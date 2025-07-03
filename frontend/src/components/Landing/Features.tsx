export default function FeaturesGrid() {
  const features = [
    {
      title: "Prompt-to-Video",
      description: "Turn simple prompts into intelligent animations instantly.",
    },
    {
      title: "250+",
      description: "animations generated",
    },
    {
      title: "Create Without limits",
      description:
        "Visura is completely free—no trials, no paywalls. Focus on your ideas, not your wallet.",
    },
    {
      title: "Educator-Friendly",
      description: "Designed for classrooms, creators, and curious minds.",
    },
    {
      title: "MP4 Output",
      description:
        "Clean, downloadable video output ideal for sharing or presenting.",
    },

    {
      title: "Powered by Manim",
      description: "Built on the same engine behind 3Blue1Brown’s animations.",
    },
  ];

  return (
    <>
      <div
        id="features"
        className="text-center font-medium mt-32 sm:mt-32 pt-10 pb-4 sm:pb-8 text-2xl sm:text-4xl font-inter tracking-[-0.08em]
      bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent
      "
      >
        Smart Features Designed for Creative Clarity
      </div>
      <div className="flex justify-center items-center min-h-screen">
        <div className="sm:border sm:border-white/10 p-4 grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-3 gap-x-10 gap-y-5 h-fit sm:h-[700px] ">
          {features.map((feat, index) =>
            index == 0 || index == 2 || index == 3 ? (
              <div
                key={index}
                className={`row-span-2 w-[300px] sm:w-[240px] lg:w-[280px]`}
              >
                <FeatureCard
                  title={feat.title}
                  description={feat.description}
                />
              </div>
            ) : (
              <div
                key={index}
                className="row-span-1 w-[300px] sm:w-[200px] lg:w-[240px]"
              >
                {index == 1 ? (
                  <BadgeCard
                    title={feat.title}
                    description={feat.description}
                  />
                ) : (
                  <ShortFeatureCard
                    title={feat.title}
                    description={feat.description}
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

const FeatureCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className=" relative w-full h-[220px] sm:h-full flex flex-col justify-between feature-card p-8">
      <div
        className="absolute inset-0 bg-[size:50px_50px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]
      sm:bg-[size:60px_60px]
      "
      ></div>
      <div className="text-xl sm:text-4xl tracking-tighter font-semibold bg-gradient-to-r from-white to-[#AA9CFC] bg-clip-text text-transparent leading-tight">
        {title}
      </div>
      <div className="text-base sm:text-lg text-slate-300">{description}</div>
    </div>
  );
};
const ShortFeatureCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="relative w-[300px] h-[150px] sm:w-[250px] lg:w-[290px] sm:h-full flex flex-col justify-between short-feature-card p-4">
      <div
        className="absolute inset-0 bg-[size:50px_50px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]
      sm:bg-[size:60px_60px]
      "
      ></div>
      <div className="p-2 sm:p-0 sm:text-center text-xl sm:text-4xl tracking-tighter font-semibold bg-gradient-to-r from-white to-[#6633EE] bg-clip-text text-transparent leading-tight">
        {" "}
        {title}
      </div>
      <div className="text-sm sm:text-base text-slate-300">{description}</div>
    </div>
  );
};
const BadgeCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="hidden sm:flex relative w-[250px] lg:w-[280px] h-full flex-col justify-between feature-card p-6">
      <div
        className="absolute inset-0 bg-[size:50px_50px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]
      sm:bg-[size:60px_60px]
      "
      ></div>
      <div className="text-center text-xl sm:text-6xl tracking-tighter font-semibold bg-gradient-to-r from-white  to-[#6633EE] bg-clip-text text-transparent leading-tight">
        {title}
      </div>
      <div className="text-xl flex justify-center w-full ">
        <span className="bg-purple-600/10 py-1.5 px-0.5 border-l-2 border-r-2 border-purple-600 text-[#AA9CFC]">
          {description}
        </span>
      </div>
    </div>
  );
};
