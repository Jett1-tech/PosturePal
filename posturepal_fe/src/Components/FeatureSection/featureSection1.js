import { Divider } from "antd";
import Feature1 from "../../Images/Feature/Feature1/Fea11.webp";
import Feature2 from "../../Images/Feature/Feature1/Fea21.webp";
import Feature3 from "../../Images/Feature/Feature1/Fea31.webp";
import Feature4 from "../../Images/Feature/Feature1/Fea41.webp";

const features = [
  { name: "Origin", description: "Designed by Good Goods, Inc." },
  {
    name: "Material",
    description:
      "Solid walnut base with rare earth magnets and powder coated steel card cover",
  },
  { name: "Dimensions", description: '6.25" x 3.55" x 1.15"' },
  { name: "Finish", description: "Hand sanded and finished with natural oil" },
  { name: "Includes", description: "Wood card tray and 3 refill packs" },
  {
    name: "Considerations",
    description:
      "Made from natural materials. Grain and color vary with each item.",
  },
];
export default function Example() {
  return (
    <div className="bg-white">
      {" "}
      <div className="mx-auto grid  grid-cols-1 items-center gap-x-8 gap-y-16 px-4 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
        {" "}
        <div>
          {" "}
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {" "}
            Technical Specifications{" "}
          </h2>{" "}
          <p className="mt-4 !text-gray-600">
            {" "}
            The walnut wood card tray is precision milled to perfectly fit a
            stack of Focus cards. The powder coated steel divider separates
            active cards from new ones, or can be used to archive important task
            lists.{" "}
          </p>{" "}
          <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
            {" "}
            {features.map((feature) => (
              <div key={feature.name} className="border-t border-gray-200 pt-4">
                {" "}
                <dt className="font-medium text-gray-900">
                  {feature.name}
                </dt>{" "}
                <dd className="mt-2 text-sm !text-gray-600">
                  {" "}
                  {feature.description}{" "}
                </dd>{" "}
              </div>
            ))}{" "}
          </dl>{" "}
        </div>{" "}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
          {" "}
          <img
            alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
            src={Feature4}
            className="rounded-lg bg-gray-100"
          />{" "}
          <img
            alt="Top down view of walnut card tray with embedded magnets and card groove."
            src={Feature2}
            className="rounded-lg bg-gray-100"
          />{" "}
          <img
            alt="Side of walnut card tray with card groove and recessed card area."
            src={Feature3}
            className="rounded-lg bg-gray-100"
          />{" "}
          <img
            alt="Walnut card tray filled with cards and card angled in dedicated groove."
            src={Feature1}
            className="rounded-lg bg-gray-100"
          />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
