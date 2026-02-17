

const Marquee = ({ reversed = false }: { reversed?: boolean }) => {
    const text = "Indian Society For Technical Education";

    return (
        <div className="relative w-full h-16 overflow-hidden rounded-md bg-black">
            <div className={`absolute flex h-full w-max animate-marquee whitespace-nowrap ${reversed ? 'animate-marqueeReverse' : ''}`}>
                {/* First track */}
                <MarqueeItem text={text} />
                {/* Second track (duplicate for seamless loop) */}
                <MarqueeItem text={text} />
            </div>
        </div>
    );
};

const MarqueeItem = ({ text }: { text: string }) => (
    <div className="flex items-center">
        {Array.from({ length: 6 }).map((_, i) => (
            <div
                key={i}
                className="mx-8 inline-flex items-center gap-4"
            >
                <img
                    src="/iste_icon.png"
                    alt="ISTE Icon"
                    className="h-6 w-6 object-contain"
                />
                <span className="text-2xl font-medium text-primary">
                    {text}
                </span>
            </div>
        ))}
    </div>
);

export default Marquee;
