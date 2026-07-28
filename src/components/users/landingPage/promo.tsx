import { Input } from "@heroui/react";
import promoOne from "../../../assets/promo-one.png";
import promoTwo from "../../../assets/promo-two.png";

export function Promo() {
  return (
    <section className="w-full">
      <div className="flex flex-col mb-4 lg:flex-row gap-4 sm:gap-5 md:gap-6 w-full">
        {/* Mid-Year Sale card */}
        <div
          className="relative flex-1 min-w-0 overflow-hidden rounded-2xl md:rounded-3xl bg-cover bg-center flex flex-col justify-center px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10"
          style={{ backgroundImage: `url(${promoOne})` }}
        >
          <p className="text-white/90 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
            UP TO 80% OFF
          </p>
          <h2 className="text-white text-xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-4 sm:mb-6 tracking-tight">
            MID-YEAR SALE
          </h2>
          <button
            type="button"
            className="w-fit bg-white text-[#3654D6] cursor-pointer text-xs sm:text-sm font-semibold rounded-full px-4 py-2 sm:px-6 sm:py-2.5 hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </button>
        </div>

        {/* Subscribe card */}
        <div
          className="relative flex-1 min-w-0 overflow-hidden rounded-2xl md:rounded-3xl bg-cover bg-center flex flex-col justify-center px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10"
          style={{ backgroundImage: `url(${promoTwo})` }}
        >
          <p className="text-white/90 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
            Never want to miss a deal?
          </p>
          <h2 className="text-white text-xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-4 sm:mb-6 tracking-tight">
            SUBSCRIBE NOW
          </h2>
          <div className="flex flex-row items-center gap-2 sm:gap-3">
            <Input
              type="email"
              aria-label="Email address"
              placeholder="youremail@gmail.com"
              className="flex-1 min-w-0 rounded-full border-none bg-white px-3 py-2 text-xs text-gray-700 shadow-none outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/60 sm:h-11 sm:px-4 sm:text-sm"
            />
            <button
              type="button"
              className="shrink-0 cursor-pointer whitespace-nowrap bg-[#3654D6] text-white text-xs sm:text-sm font-semibold rounded-full px-4 py-2 sm:px-6 sm:py-2.5 hover:bg-[#2d47bd] transition-colors"
            >
              Subscribe now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}