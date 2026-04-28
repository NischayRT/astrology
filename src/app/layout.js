// src/app/layout.js

export const metadata = {
  title: "Nakshatra Jyotish",
  description: "Ancient Wisdom · Modern Guidance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* We moved the global fonts and CSS resets here so EVERY page gets them */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&display=swap');
          
          * { 
            box-sizing: border-box; 
            margin: 0; 
            padding: 0; 
          }
          
          body { 
            background: #FDF6EC; 
            font-family: 'Cormorant Garamond', Georgia, serif;
          }
          
          input::placeholder { color: rgba(107,68,35,0.4); }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #FDF6EC; }
          ::-webkit-scrollbar-thumb { background: rgba(196,132,90,0.4); border-radius: 3px; }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}