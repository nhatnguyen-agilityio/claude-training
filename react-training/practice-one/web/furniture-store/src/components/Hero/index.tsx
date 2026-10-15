const Hero = () => {
  return (
    <section className="mt-12 container">
      <div className="lg:px-0 mb-8">
        <h2 className="text-sm mb-4 md:mb-6 md:text-lg">FURNITURE STORE</h2>
        <h3 className="px-6 text-2xl mb-4 font-semibold md:mb-6 md:text-5xl md:font-bold lg:text-6xl">
          Discover the Artistry of Modern Contemporary Furniture
        </h3>
        <p className="text-base text-center md:text-xl">
          Experience the elegance and functionality of cutting-edge design where
          luxury meets innovation in every piece for ultimate relaxation
        </p>
      </div>
      <div className="w-full h-59 md:h-100 lg:h-106 relative bg-gray-50">
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet="https://ucarecdn.com/d474fba4-43b2-42d5-ace1-a804990777c5/-/resize/1280x/-/format/auto/-/quality/smart/"
            width="1280"
            height="720"
          />
          <source
            media="(min-width: 640px)"
            srcSet="https://ucarecdn.com/6b6ab92c-287c-449a-8663-28380c902884/-/resize/1024x/-/format/auto/-/quality/smart/"
            width="1024"
            height="576"
          />
          <img
            src="https://ucarecdn.com/658288ac-40ec-43dd-893a-3c62c979259c/-/resize/640x/-/format/auto/-/quality/smart/"
            alt="Modern contemporary furniture showcasing elegant living room furniture"
            className="w-full h-full object-cover"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            width="640"
            height="360"
            sizes="(max-width: 639px) 640px, (max-width: 1023px) 1024px, 1280px"
            style={{ contentVisibility: 'auto' }}
          />
        </picture>
      </div>
    </section>
  );
};

export default Hero;
