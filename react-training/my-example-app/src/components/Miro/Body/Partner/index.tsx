import Company from "./Company";
import cisco from "../../assets/cisco.png";
import volvo from "../../assets/volvo.png";
import deloitte from "../../assets/deloitte.png";
import walmart from "../../assets/walmart.png";
import okta from "../../assets/okta.png";

const partnerIcons = [
  {id: 1, src: walmart},
  {id: 2, src: cisco},
  {id: 3, src: volvo},
  {id: 4, src: deloitte},
  {id: 5, src: okta},
]

const Partner = () => {
  return (
    <div className="my-13 pb-13">
      <div className="container">
        <h5 className="pt-5 font-light text-lg text-center">Trusted by 45M+ users</h5>
        <div className="grid grid-cols-5 h-20 mt-3">
          {partnerIcons.map((item) => (
            <Company key={item.id} img={item.src} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default Partner;
