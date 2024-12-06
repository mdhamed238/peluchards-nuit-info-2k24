import React from "react";
import { BASE_URL } from "../constants/api";

function Act() {
  return (
    // if it works, don't touch it!
    <iframe src={`${BASE_URL}/act`} title='Act' className='w-full h-screen' />
  );
}

export default Act;
