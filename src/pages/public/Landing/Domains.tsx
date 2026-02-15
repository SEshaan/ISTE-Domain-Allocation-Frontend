import Header from "../../../components/header";

function DomainSelection() {

  return (
    <section className="bg-primary">
      <Header title="Domains" />

      <div className="min-h-screen py-12">
        <div className="mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center align-items-center">
            {[
              { id: 'AP', name: 'App Dev', img: '/Domains/AP.png' },
              { id: 'WD', name: 'Web Dev', img: '/Domains/WD.png' },
              { id: 'IT', name: 'IoT', img: '/Domains/IT.png' },
              { id: 'ML', name: 'Machine Learning', img: '/Domains/ML.png' },
              { id: 'DS', name: 'Design', img: '/Domains/DS.png' },
              { id: 'MG', name: 'Motion Graphics', img: '/Domains/MG.png' },
              { id: 'XR', name: 'GameDev / XR', img: '/Domains/XR.png' },
              { id: 'EL', name: 'Electrical', img: '/Domains/EL.png' },
              { id: 'CP', name: 'Competitive Programming', img: '/Domains/CP.png' },
              { id: 'MT', name: 'Management', img: '/Domains/MT.png' },
            ].map((d) => (

              <img src={d.img} alt={d.name} className="w-full object-contain" />

            ))}
          </div>
        </div>
      </div>
    </section>

  );
}

export default DomainSelection;
