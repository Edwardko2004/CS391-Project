import Image from "next/image";
import Navbar from "./components/Navbar";
import EventCard from "./components/Card";
import Footer from "./components/Footer";


export default function Home() {
  return (
    <>
      <Navbar></Navbar>
      
      <main className="m-15 flex flex-col items-center">
        <h1 className="text-4xl">Welcome to Spark! Bytes</h1>
        <br></br>
        <div>
          <h2 className="text-2xl">Recent Events:</h2>
          <EventCard></EventCard>
        
        </div>
      </main>
      <Footer></Footer>
    </>
      
  
  );
}
