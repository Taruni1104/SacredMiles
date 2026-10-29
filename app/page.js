
"use client";

import { useRouter } from 'next/navigation';
import { TRIP_TYPES } from '@/lib/data';
import { Camera, Scale, ArrowRight } from 'lucide-react';

const IconMap = {
  Om: () => <span className="text-5xl mb-2 filter drop-shadow-lg">🕉️</span>,
  Camera: () => <Camera className="w-12 h-12 mb-2" />,
  Scale: () => <Scale className="w-12 h-12 mb-2" />
};

export default function Home() {
  const router = useRouter();
  const handleSelect = (typeId) => {
    // Navigate to planner with pre-selected type
    router.push(`/planner?type=${typeId}`);
  };

  return (
    <main className="min-vh-100">
      <section className="hero-panel py-5 py-lg-6">
        <div className="container py-5 text-center">
          <p className="section-label">A considered journey across India</p>
          <h1 className="display-2 fw-bold mb-4">
            Begin Your <span className="text-warning fst-italic">Yatra</span>
          </h1>
          <p className="lead mx-auto mb-0" style={{ maxWidth: '42rem' }}>
            Discover sacred places, thoughtful routes, and a calmer way to plan
            a pilgrimage shaped around your purpose.
          </p>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          {TRIP_TYPES.map((type) => {
            const IconComponent = IconMap[type.icon];
            return (
              <div className="col-12 col-md-4" key={type.id}>
                <article className="journey-card h-100 rounded-3 p-4 d-flex flex-column">
                  <div className="mb-4 text-forest" aria-hidden="true">
                    <IconComponent />
                  </div>
                  <h2 className="h3 mb-3">{type.title}</h2>
                  <p className="text-secondary flex-grow-1">{type.description}</p>
                  <button
                    type="button"
                    className="btn btn-forest w-100 mt-3"
                    onClick={() => handleSelect(type.id)}
                  >
                    Select journey <ArrowRight className="ms-2" size={18} />
                  </button>
                </article>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
