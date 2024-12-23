'use client'

import { Slide1, Slide2, Slide3 } from "@/constants";
import Image from "next/image";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const slides = [ Slide1, Slide2, Slide3 ]

function Slide({ slide }: { slide: any }) {
    return (
        <div>
            <Image 
                src={slide} 
                alt="slide" 
                width={100} 
                height={50}
                className="w-full rounded-2xl h-96 object-cover"
            />
        </div>
    )
}

export function Slides() {
    return (
        <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ 
                clickable: true,
            }}
            autoplay={{
                delay: 2000,
                pauseOnMouseEnter: true
            }}
        >
            {slides.map((slide, i) => <SwiperSlide key={i}>
                <Slide slide={slide}  />
            </SwiperSlide>)}
        </Swiper>
    )
}