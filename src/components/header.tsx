import Title from "./title"

export default function Header({ title, theme = "light"} : { title: string, theme?: "light" | "dark"}) {
    return (
        <div
            className="
            relative
            w-full
            h-[20vh] md:h-[30vh]
            bg-no-repeat bg-bottom bg-cover
            mb-12 md:mb-16
          "
            style={{ backgroundImage: { light: "url('/divider_black.png')", dark: "url('/divider_beige.png')" }[theme] }}
        >
            <div className="absolute bottom-[-10%] md:bottom-[-25%] w-full text-center">
                <Title className="text-[10vh] md:text-[25vh] relative">
                    {title}
                </Title>
            </div>
        </div>
    )
}