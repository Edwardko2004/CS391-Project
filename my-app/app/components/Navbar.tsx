export default function Navbar(){
    return(
    <nav className="flex justify-between bg-[#0BA698] p-10 text-2xl font-bold">
        <div className="left text-[#CFDACC] ">
            <a >Home</a>
            <a className="m-5">Create</a>
        </div>
        <div>
            <a className="m-5">Sign up</a>
            <a>Log in</a>
        </div>
        
    </nav>)
}