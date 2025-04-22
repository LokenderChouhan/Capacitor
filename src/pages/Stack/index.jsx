import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import useProducts from "../../hooks/useProducts";
import { useCart } from "../../hooks/useCart";
import { filter, includes } from "lodash";

// Configuration for swipe threshold and animation
const SWIPE_THRESHOLD_X = 200; // Min distance in pixels to trigger a swipe
const SWIPE_THRESHOLD_Y = 300; // Min distance in pixels to trigger a swipe
const SNAP_BACK_DURATION = 300; // ms for snap back animation

export default function Stack() {
  const { data: initialData } = useProducts();
  const {
    state: { products : cartProducts, wishlist, rejected, showCart },
    actions: { addProduct, addToWishlist, addToRejected },
  } = useCart();

  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); // Track the top card

  // State for drag interaction
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [cardStyle, setCardStyle] = useState({}); // Style for the top card

  // Ref to access the card element if needed (optional for now)
  const activeCardRef = useRef(null);

  let timeoutId = null;

  useEffect(() => {
    if (initialData) {
      const availableProducts = filter(
        initialData,
        ({ id }) => !includes([...cartProducts,...wishlist,...rejected], id)
      );
      setProducts(availableProducts);
      setActiveIndex(availableProducts.length - 1); // Start with the last item as the top card
    }
  }, [initialData, showCart]); // , cartProducts, wishlist, rejected

  const resetCardPosition = (withAnimation = true) => {
    setCardStyle({
      transform: "translate(0px, 0px) rotate(0deg)",
      transition: withAnimation
        ? `transform ${SNAP_BACK_DURATION}ms ease-out`
        : "none",
    });
    // Clear transition after animation to prevent it affecting dragging
    if (withAnimation) {
      setTimeout(() => {
        setCardStyle((prev) => ({ ...prev, transition: "none" }));
      }, SNAP_BACK_DURATION);
    }
  };

  const handleSwipe = (direction) => {
    const swipedCardId = products[activeIndex]?.id;
    if (!swipedCardId) return;

    console.log(`Swiped ${direction}: ${swipedCardId}`);
    setIsDragging(false);

    if (direction === "top") {
      const flyOutX = 0; //currentPos.x * 2; // Exaggerate horizontal movement
      const flyOutY = -window.innerHeight; // Move up off screen
      const flyOutRotate = (flyOutX / window.innerWidth) * 15; // Subtle rotation for top swipe
      addProduct(products[activeIndex]?.id);
      setCardStyle({
        transform: `translate(${flyOutX}px, ${flyOutY}px) rotate(${flyOutRotate}deg)`,
        transition: `transform ${SNAP_BACK_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      });
    } else if (direction === "left" || direction === "right") {
      if (direction === "right") {
        addToWishlist(products[activeIndex]?.id);
      }
      else {
        addToRejected(products[activeIndex]?.id);
      }
      // Animate card off-screen (example: move further in the swipe direction)
      const flyOutX =
        direction === "right" ? window.innerWidth : -window.innerWidth;
      const flyOutY = currentPos.y * 2; // Exaggerate vertical movement
      const flyOutRotate = (flyOutX / window.innerWidth) * 45; // Rotate based on direction
      setCardStyle({
        transform: `translate(${flyOutX}px, ${flyOutY}px) rotate(${flyOutRotate}deg)`,
        transition: `transform ${SNAP_BACK_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      });
    }

    // Wait for animation, then remove card and reset state
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setProducts((prev) => prev.filter((_, index) => index !== activeIndex));
      setActiveIndex(activeIndex - 1); // Move to the next card (which is now the last)
      setIsDragging(false); // Reset dragging state
      resetCardPosition(false); // Reset style for the *new* top card without animation
    }, SNAP_BACK_DURATION);
  };

  const handleDragStart = (e) => {
    // Prevent default drag behavior (like image ghosting)
    e.preventDefault();
    // Only allow dragging the top card
    if (activeIndex < 0) return;

    setIsDragging(true);
    // Use pageX/pageY for consistency across mouse/touch
    const currentX = e.pageX ?? e.touches?.[0]?.pageX;
    const currentY = e.pageY ?? e.touches?.[0]?.pageY;
    setStartPos({ x: currentX, y: currentY });
    setCurrentPos({ x: 0, y: 0 }); // Reset delta
    setCardStyle({ transition: "none" }); // Remove transition during drag
  };

  const handleDragMove = (e) => {
    if (!isDragging || activeIndex < 0) return;

    const currentX = e.pageX ?? e.touches?.[0]?.pageX;
    const currentY = e.pageY ?? e.touches?.[0]?.pageY;

    const deltaX = currentX - startPos.x;
    const deltaY = currentY - startPos.y;

    setCurrentPos({ x: deltaX, y: deltaY });

    // Calculate rotation (simple example: more rotation further from center)
    const rotate = deltaX * 0.1; // Adjust multiplier for desired rotation sensitivity
    // Calculate scale and opacity based on vertical movement
    // Check if we've passed the vertical threshold for a top swipe
    if (Math.abs(deltaY) > SWIPE_THRESHOLD_Y) {
      if (deltaY < 0) handleSwipe("top");
      else return; // avoid bottom swipe
    } else if (Math.abs(deltaX) > SWIPE_THRESHOLD_X) {
      handleSwipe(deltaX > 0 ? "right" : "left");
    } else {
      // Apply transform directly
      setCardStyle({
        transform: `translate(${deltaX}px, ${deltaY}px) rotate(${rotate}deg)`,
        transition: "none", // Ensure no transition while dragging
      });
    }
  };

  const handleDragEnd = () => {
    if (!isDragging || activeIndex < 0) return;

    setIsDragging(false);

    const deltaX = currentPos.x;
    const deltaY = currentPos.y; // Could use Y for up/down swipes

    if (Math.abs(deltaY) > SWIPE_THRESHOLD_Y) {
      handleSwipe(deltaY > 0 ? "bottom" : "top");
    } else if (Math.abs(deltaX) > SWIPE_THRESHOLD_X) {
      // Swipe completed
      handleSwipe(deltaX > 0 ? "right" : "left");
    } else {
      // Snap back to center
      resetCardPosition();
    }

    // Reset positions after check
    setStartPos({ x: 0, y: 0 });
    setCurrentPos({ x: 0, y: 0 });
  };

  // Attach mouse/touch listeners conditionally
  const eventHandlers =
    activeIndex >= 0
      ? {
          onMouseDown: handleDragStart,
          onTouchStart: handleDragStart,
          // Attach move/end listeners to the window/document to capture events
          // even if the cursor leaves the card element during a drag.
        }
      : {};

  // Add window listeners when dragging starts
  useEffect(() => {
    const handleMove = (e) => handleDragMove(e);
    const handleEnd = () => handleDragEnd();

    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("touchmove", handleMove, { passive: false }); // passive: false if preventDefault is needed
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchend", handleEnd);
    }

    // Cleanup listeners
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchend", handleEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, startPos]); // Re-bind if startPos changes (relevant for calculating delta)

  // Render only a few cards for performance, or apply styles only to top one
  return (
    <div className="h-[95%] relative flex justify-center items-center">
      {/* <Header/> */}
      {products.length > 0 ? (
        products.map((product, index) => {
          // Apply interaction handlers and dynamic style ONLY to the top card
          const isTopCard = index === activeIndex;

          const style = isTopCard
            ? cardStyle
            : {
                // Style for cards underneath (optional: slight scale/offset)
                //  transform: `scale(${1 - (activeIndex - index) * 0.05}) translateY(${(activeIndex - index) * 10}px)`,
                //  zIndex: products.length - index // Ensure correct stacking order
              };
          const handlers = isTopCard ? eventHandlers : {};

          // Only render the top few cards if performance becomes an issue
          //  if (index < activeIndex - 2) return null; // Example: Render only top 3 cards

          return (
            <div
              key={product.id}
              ref={isTopCard ? activeCardRef : null}
              className="absolute w-[95%] h-[95%]" //full Container for positioning
              style={{ zIndex: products.length + index }} // Stacking order
              {...handlers} // Attach mouse/touch down handlers here
            >
              <Card
                data={product}
                style={style} // Pass the calculated style to the Card
              />
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center">
          <img
            src="/images/sad.png"
            alt="Image from public folder"
            width={60}
          />
          <div className="mt-2 text-zinc-400 text-center">
            Phew, you made it to the bottom! <br />
            We might have more in store
          </div>
        </div>
      )}
    </div>
  );
}
