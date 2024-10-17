import Png from "../image.png";
import Webp from "../image.webp";

export default function Page() {
  return (
    <>
      There is an image below here: <br />
      <div>
        webp
        <br />
        <img src={Webp} style={{ width: "400px", height: "400px" }} />
      </div>
      <div>
        png
        <br />
        <img src={Png} style={{ width: "400px", height: "400px" }} />
      </div>
    </>
  );
}
