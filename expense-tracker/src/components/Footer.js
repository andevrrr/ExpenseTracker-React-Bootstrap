import React from "react";

const Footer = () => {
  return (
    <footer className="text-center py-3 px-2 ">
      <p className="mb-1">
        Developed by <strong>Anton Kucherenko</strong>
      </p>
      <p className="mb-1">
        Email:{" "}
        <a className="primary-color" href="mailto:ak@anton-kucherenko.com">
          ak@anton-kucherenko.com
        </a>
      </p>
      <p className="mb-1">
        Phone:{" "}
        <a
          className="primary-color block md:inline-block"
          href="tel:+358451694688"
        >
          +358 45 169 4688
        </a>
      </p>
      <p className="mb-1">
        Visit my website:{" "}
        <a
          className="primary-color"
          href="https://anton-kucherenko.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          anton-kucherenko.com
        </a>
      </p>
      <p className="mb-1 ">
        This application is powered by{" "}
        <a
          className="primary-color"
          href="https://openai.com/chatgpt"
          target="_blank"
          rel="noopener noreferrer"
        >
          ChatGPT
        </a>
        .
      </p>
      <p className="mt-2">© 2024 Anton Kucherenko. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
