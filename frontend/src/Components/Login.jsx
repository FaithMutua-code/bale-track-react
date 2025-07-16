import { useState } from "react";

export default function LoginPopUp({setShowLogin}) {
    
    const [currentState, setCurrentState ] = useState('Login')

    const [data , setData] = useState ({
        name: '',
        email: '',
        password: ''
    })


    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setData(data => ({
            ...data,
            [name]: value
        }))
    }

    const onLogin = async (event) => {

        event.preventDefault()




    }



    return (
        <form onSubmit={onLogin}
         className="bg-white text-gray-500 max-w-[350px] mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">

            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">{currentState}</h2>

            { currentState  ===  "Login" ? <></> :  <input id="name" className="w-full border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4" onChange={onChangeHandler}  name="name"  type="text" placeholder="Enter your name" value={data.name} required />}
            <input id="email" className="w-full border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4" type="email" onChange={onChangeHandler} placeholder="Enter your email" value={data.email} name="email" required />
            <input id="password" className="w-full border mt-1 border-gray-500/30 outline-none rounded-full py-2.5 px-4" type="password"  onChange={onChangeHandler} placeholder="Enter your password" value={data.password} name="password" required />
            <div className="text-right py-4">
                <a className="text-blue-600 underline" href="#">Forgot Password</a>
            </div>
            <button type="submit" className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600/90 active:scale-95 transition py-2.5 rounded-full text-white">{currentState === "Sign Up" ? "Create Account" : "Login"}</button>
            

           {currentState === "Login" ? (
            <p className="text-center mt-4">
                Don’t have an account?{" "}
                <span
                className="text-blue-500 underline cursor-pointer"
                onClick={() => setCurrentState("Sign Up")}
                >
                Sign Up here
                </span>
            </p>
                ) : (
            <p className="text-center mt-4">
                Already have an account?{" "}
                <span
                className="text-blue-500 underline cursor-pointer"
                onClick={() => setCurrentState("Login")}
                >
                Sign In
                </span>
            </p>
            )}

        </form>
    );
};