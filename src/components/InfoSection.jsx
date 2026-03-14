import React from 'react'

function InfoSection() {
  return (
   <section>
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
      
      <div>
        <img
          src="https://imgs.search.brave.com/V5yVkc7P9ZpKVzEQVbw4VLUD8BKWKi_44LSc1KL2VcQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvODY3/ODI0LmpwZw"
          className="rounded"
          alt=""
        />
      </div>

      <div>
        <div className="max-w-prose md:max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </h2>

          <p className="mt-4 text-pretty text-gray-700">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur doloremque saepe
            architecto maiores repudiandae amet perferendis repellendus, reprehenderit voluptas
            sequi.
          </p>
        </div>
      </div>

    </div>
  </div>
</section>
  )
}

export default InfoSection