import { auth, provider } from "../../../firebase";
import { signInWithPopup } from "firebase/auth";
import ImageBackground from "../../../components/landing";
import Marquee from "../../../components/marquee";
import Title from "../../../components/title";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../features/authSlice";
import { fetchDomains } from "../../../features/domainSlice";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      // 1️⃣ Firebase Login
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      // 2️⃣ Send token to backend
      const response = await fetch("http://localhost:3500/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
          'x-api-key' : "e854c681c0acc98dfb3a93686aeb9c3907198bddec47d88dc46c3a15856ff7b0"
        },
      });

      if (!response.ok) {
        throw new Error("Backend login failed");
      }

      const data = await response.json();
      console.log(data.user);

      // 3️⃣ Dispatch to Redux
      dispatch(
        loginSuccess({
          user: {
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            regNo: data.user.regNo,
            branch: data.user.branch,
            githubLink: data.user.githubLink || "",
            leetcodeLink: data.user.leetcodeLink || "",
            portfolioLink: data.user.portfolioLink || "",
            selectedDomainIds: data.user.selectedDomainIds || [],
          },
          token: idToken,
          role: "USER", // todo: remove role from frontend and rely on backend validation
          profileComplete:
            data.user.githubLink &&
            data.user.leetcodeLink &&
            data.user.portfolioLink,
        })
      );
      // @ts-ignore
      dispatch(fetchDomains());

      // 4️⃣ Optional: store token
      localStorage.setItem("token", idToken);

      // 5️⃣ Redirect
      navigate("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);
    }
  };


  return (
    <div className="relative min-h-screen overflow-hidden">
      <ImageBackground />

      <div className="z-10 flex h-screen w-full flex-col items-center justify-between px-6 text-center">
        <Marquee />

        <div className="space-y-6">
          <div className='flex flex-col'>
            <Title className='text-[25vmin] md:text-[30vmin] -my-16 md:-my-32'>
              Domain
            </Title>
            <Title className='text-[20vmin] md:text-[25vmin]'>
              Allocation
            </Title>
          </div>

          <button
            onClick={loginWithGoogle}
            className="
              inline-block
              rounded-lg
              bg-primary
              px-8
              py-3
              font-medium
              text-black
              text-3xl
              transition
              hover:scale-105
              hover:bg-white
            "
          >
            Login with Google
          </button>
        </div>

        <Marquee reversed />
      </div>
    </div>
  );
}
