import { isMobile } from "react-device-detect";
import ReactDOM from "react-dom";
import HumanMusic from "./human-music/human-music";
import "./styles/index.css";

const disableBodyScroll = require("body-scroll-lock").disableBodyScroll;
const targetElement = document.querySelector("#root");

ReactDOM.render(<HumanMusic />, document.getElementById("root"));

if (isMobile) {
  disableBodyScroll(targetElement);
}
