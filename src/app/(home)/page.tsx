import ProjectForm from "@/modules/home/ui/components/ProjectForm";
import ProjectList from "@/modules/home/ui/components/ProjectList";
import Image from "next/image";

export default function Home() {


  return (
    <div className="pt-[16vh] 2xl:pt-38 flex justify-center items-center">
      <section className="max-w-lg md:max-w-5xl flex flex-col gap-7 justify-center items-center">
        <Image src={"/aiLogo.svg"} alt="Vibe" width={50} height={50} />

        <h1 className="text-xl md:text-5xl font-bold">
          Build something with Vibe
        </h1>

        <p className="text-md md:text-xl text-muted-foreground">
          Create apps and websites by chatting with AI
        </p>
        <div className="w-xs md:w-3xl">
          <ProjectForm />
        </div>
        <div className="w-xs md:w-5xl mt-20">
          <ProjectList />
        </div>
      </section>
    </div>
  );
}
