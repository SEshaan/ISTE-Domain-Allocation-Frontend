import Header from "../../../components/header";

function DomainSelection() {

  const domains = [
    { id: 'AP', name: 'App Dev', img: '/Domains/AP.png' },
    { id: 'WD', name: 'Web Dev', img: '/Domains/WD.png' },
    { id: 'IT', name: 'IoT', img: '/Domains/IT.png' },
    { id: 'ML', name: 'Machine Learning', img: '/Domains/ML.png' },
    { id: 'DS', name: 'Design', img: '/Domains/DS.png' },
    { id: 'MG', name: 'Motion Graphics', img: '/Domains/MG.png' },
    // { id: 'XR', name: 'GameDev / XR', img: '/Domains/XR.png' },
    { id: 'EL', name: 'Electrical', img: '/Domains/EL.png' },
    { id: 'CP', name: 'Competitive Programming', img: '/Domains/CP.png' },
    { id: 'MT', name: 'Management', img: '/Domains/MT.png' },
    { id: 'MT2', name: 'Management2', img: '/Domains/MT2.png' },
    { id: 'PB', name: 'Publicity', img: '/Domains/PB.png' },
  ];

  return (
    <section className="bg-primary">
      <Header title="Domains" />

      <div className="min-h-screen py-12">
        <div className="mx-auto px-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 justify-items-center">

            {domains.map((d,index) => {
              const rotation = Math.floor(Math.random() * 5)*([-1,1,1,-1][index % 4]); // Random rotation between -10 and 10 degrees

              return (
                <img
                  key={d.id}
                  src={d.img}
                  alt={d.name}
                  style={{ transform: `rotate(${rotation}deg)` }}
                  className="w-[80vw] md:w-[40vw] object-contain -m-4 transition-transform duration-300 hover:rotate-0 hover:scale-105"
                />
              );
            })}

          </div>

        </div>
      </div>
    </section>
  );
}

export default DomainSelection;