import React from 'react';

const LandingPage = ({ onProceed}) => {
    return(
        <>
        <div className="min-h-screen bg-gradient-to-b from-purple-100 via-purple-300 to-blue-50 flex flex-col justify-center items-center text-center p-9">
            <h1 className="text-3xl sm:text-4xl font-bold text-purple-700 mb-4">🎉 Welcome to Mission P-22! 🎉</h1>

            <p className="text-lg sm:text-xl text-gray-900 mb-6 text-center mt-2">
        Hi there! 👋 I'm Aneesha, a friend of Pranitha, and I've created this special website to collect heartfelt messages and surprises from all her loved
        ones 💌🎨, for her 22nd birthday! 🎂
      </p>
      <p className="text-lg sm:text-xl text-gray-800 mb-6">
        The goal is simple - Just share your love and creativity here. Your message will
        be delivered to Pranitha on her birthday! 🎂
      </p>
      <p className="text-lg sm:text-xl text-gray-600 mb-6">
        💡 **Important**: Please make sure this app doesn't reach her before her birthday! ⏳ Let's keep the surprise intact! 🤫
      </p>

      <button
        onClick={onProceed}
        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-md shadow-md text-lg font-semibold transition duration-300"
      >
        Start the Fun! 🚀
      </button>

        </div>
        </>
    )
}

export default LandingPage;