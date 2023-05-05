import React from 'react'
import tw from 'twin.macro'

function Counter({ value }) {
    return (
        <div tw="bg-white py-2 px-8 border-2 rounded-xl border-black text-3xl md:text-6xl w-full text-center md:mt-4 md:mb-16">
            {value}
        </div>
    )
}

export default Counter
