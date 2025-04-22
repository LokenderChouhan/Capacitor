import {
  faChevronDown,
  faChevronUp,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { startCase } from "lodash";
import React, { useState } from "react";

export default function Card({ data, style }) {
  const { discountPercentage, originalPrice, price, name, brand, id } = data;
  return (
    <div
      className="bg-white h-full w-full rounded-lg object-cover absolute cursor-grab select-none"
      style={{
        backgroundImage: `url(${data.imageUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        touchAction: "none", // Prevent default touch actions like scrolling
        ...style, // Apply dynamic styles here
      }}
    >
      {/* <div className="flex text-white flex-col justify-end">
        {data.name}
    </div> */}
      <div className="absolute text-white bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2 rounded-b-lg">
        <div className="flex justify-between gap-1 font-bold">
          <h3 className="text-lg font-semibold">
            {id} {startCase(name)} <br />
            <div className="text-yellow-500">{startCase(brand)}</div>
          </h3>
          <div className="flex flex-col justify-end text-right">
            <h3>
                {discountPercentage ? <span>${discountPercentage}% OFF <del>${originalPrice}</del> </span> : null}
            </h3>
            <h3 className="text-yellow-500">${price}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
