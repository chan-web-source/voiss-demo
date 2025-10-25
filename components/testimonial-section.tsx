import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TestimonialSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Navigation arrows */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" className="p-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Star rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            <Button variant="ghost" size="sm" className="p-2">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Testimonial text */}
          <blockquote className="text-lg md:text-xl text-gray-700 italic leading-relaxed mb-8 max-w-3xl mx-auto">
            "One of the few companies in London that understand our needs. We needed good quality, furnished apartments
            for monthly rental, and The Flex team has always been to the top of our expectations."
          </blockquote>

          {/* Author */}
          <div className="text-center">
            <div className="font-semibold text-gray-900 text-lg">Tulsi</div>
            <div className="text-gray-600">Head of Accommodation, Zurich Insurance Group</div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
