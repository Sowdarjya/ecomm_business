import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bengali-pattern">
      <div className="absolute inset-0 bg-[url('/hero-img.png')] bg-cover bg-center bg-no-repeat ">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/20 backdrop-blur-[0.6rem]" />
      </div>

      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          Discover the perfect blend of traditional Bengali clothing and modern
          fashion.
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl font-medium mb-8">
          Explore our collection of authentic Bengali attire with a modern
          twist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-primary bg-transparent font-medium cursor-pointer py-3 px-6"
          >
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
