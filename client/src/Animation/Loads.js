import React from "react";
import { Loading } from "notiflix/build/notiflix-loading-aio";
export default function Loads() {
  return <div>{Loading.standard({svgColor:"#00B4C4"} ,'Loading...')}</div>;
}
