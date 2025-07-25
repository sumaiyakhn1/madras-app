// src/components/BottomNav.tsx
import {
    House,
    BookOpen,
    PlusCircle,
    Heart,
  } from "phosphor-react";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faMosque } from "@fortawesome/free-solid-svg-icons";
  
  const BottomNav = () => {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 shadow-md md:hidden z-50">
        <div className="flex flex-col items-center text-purple-600 text-xs">
          <House size={22} />
          <span className="font-medium">Home</span>
        </div>
        <div className="flex flex-col items-center text-gray-500 text-xs">
          <BookOpen size={22} />
          <span>Quran</span>
        </div>
       
        <div className="flex flex-col items-center text-purple-500">
          <PlusCircle size={40} weight="fill" />
        </div>
        <div className="flex flex-col items-center text-gray-500 text-xs">
        <FontAwesomeIcon icon={faMosque} size="lg" />
        <span>Maktab</span>
      </div>
        
        <div className="flex flex-col items-center text-gray-500 text-xs">
          <Heart size={22} />
          <span>Dua</span>
        </div>
      </nav>
    );
  };
  
  export default BottomNav;
  