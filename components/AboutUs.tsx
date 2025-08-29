import Link from "next/link";

const AboutUs = () => {
  return (
    <section
      id="about"
      className="relative py-16 lg:py-24 overflow-hidden bengali-pattern"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5">
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            About <span className="text-primary">Beeচিত্র</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
              Bridging Heritage and Modernity
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Beeচিত্র represents the beautiful fusion of traditional Bengali
              craftsmanship with contemporary design sensibilities. We celebrate
              the rich textile heritage of Bengal while creating pieces that
              resonate with today's fashion-conscious individuals.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our journey is rooted in preserving the authentic artisanal
              techniques passed down through generations, while reimagining them
              for the modern wardrobe. Every piece tells a story of cultural
              pride and innovative design.
            </p>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 backdrop-blur-sm border border-white/30">
              <h4 className="text-xl font-semibold text-gray-900 mb-6">
                Our Vision
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    Preserving traditional Bengali textile arts for future
                    generations
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    Creating sustainable fashion that honors our cultural roots
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    Empowering local artisans and craftspeople
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    Bringing Bengali fashion to the global stage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-white/30 max-w-4xl mx-auto">
            <h4 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
              Where Tradition Meets Innovation
            </h4>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              At Beeচিত্র, we believe that fashion is a powerful medium for
              cultural expression. Our collections showcase the intricate beauty
              of Bengali patterns, textiles, and craftsmanship, thoughtfully
              adapted for contemporary lifestyles.
            </p>
            <Link
              href="/#clothing"
              className="inline-block bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 font-medium py-3 px-8 rounded-lg text-lg transition-all duration-300"
            >
              Explore Our Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
