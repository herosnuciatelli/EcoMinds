'use client'

import * as constants from "@/constants";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React, { useEffect } from "react";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const slides = [ 
    constants.Slide1,
    constants.Slide2,
    constants.Slide3
]
const slidesPhone = [
    constants.Slide1Phone,
    constants.Slide2Phone,
    constants.Slide3Phone
]

function Slide({ slide }: { slide: StaticImport }) {
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
    const [width, setWidth] = React.useState(900)

    useEffect(() => {
        setWidth(window.innerWidth)
    }, [])
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
            onResize={() => {
                setWidth(window.innerWidth)
            }}
        >
            {width > 1000 ?
                slides.map((slide, i) => (
                    <SwiperSlide key={i}>
                        <Slide slide={slide}  />
                    </SwiperSlide>
                ))
                :
                slidesPhone.map((slide, i) => (
                    <SwiperSlide key={i}>
                        <Slide slide={slide}  />
                    </SwiperSlide>
                ))
            }
        </Swiper>
    )
}