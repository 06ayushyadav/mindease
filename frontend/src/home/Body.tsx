import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '@/apis/axios';

import mainDoctor from "../../public/doctorMain.png";
import services from "../../public/services.png";
import ourspeciality from "../../public/ourspeciality.png";

const Body = () => {
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get(`/api/counselor-booking/profile`);
      const sorted = response.data.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);
      setDoctors(sorted);
    } catch (error) {
      console.log("Not found doctors", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const navigate = useNavigate();
  const seeAllDoctors = () => navigate('/doctors');


  const [reviews, setReviews] = useState([
    { name: "Aarav Sharma", content: "MindEase really helped me overcome anxiety — the counselors were so understanding and caring!" },
    { name: "Priya Verma", content: "The 24/7 AI chat is such a relief when you just need someone to listen anytime!" },
    { name: "Rahul Mehta", content: "Amazing platform! Sessions are smooth, private, and easy to schedule." }
  ]);
  const [newName, setNewName] = useState("");
  const [newReview, setNewReview] = useState("");

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newReview.trim()) return;
    const newEntry = { name: newName, content: newReview };
    setReviews([newEntry, ...reviews]);
    setNewName("");
    setNewReview("");
  };



  return (
    <div className="font-sans text-gray-900 bg-gradient-to-br from-cyan-50 via-white to-blue-100 overflow-x-hidden">

        <div className='flex justify-between items-center'>
          <section className="py-24 px-6 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">

  <div className="max-w-xl text-center md:text-left space-y-6">
    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-cyan-700">
      Your Mind, <br /> Our Care 💙
    </h1>
    <p className="text-gray-600 text-lg leading-relaxed">
      MindEase connects you with{" "}
      <span className="font-semibold text-cyan-700">
        certified mental health professionals
      </span>{" "}
      and offers personalized self-care tools, AI chat, and private emotional
      support.
    </p>

    <div className="flex flex-wrap justify-center md:justify-start gap-4">
      <Link to="/patient-register">
        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white text-base rounded-full px-8 py-3 shadow-lg transition-all hover:shadow-xl">
          User Register
        </Button>
      </Link>
      <Link to="/patient-login">
        <Button className="bg-white text-cyan-700 hover:bg-cyan-50 border border-cyan-600 text-base rounded-full px-8 py-3 shadow-lg transition-all hover:shadow-md">
          User Login
        </Button>
      </Link>
    </div>
  </div>
</section>

  <div className='flex justify-end'>
    <div className=" md:mt-0 relative flex justify-center md:justify-end">
    <div >
      <img
        src={mainDoctor}
        alt="MindEase Illustration"
        className="w-96 md:w-[40rem]  rounded-s-full object-cover drop-shadow-2xl hover:scale-105 transition-transform duration-500"
      />
    </div>

    <div className="absolute -bottom-10 -right-10 bg-cyan-200 rounded-full w-32 h-32 blur-3xl opacity-60"></div>
  </div>    
    </div>  
        </div>
      
      <section className="py-20 bg-gradient-to-r from-cyan-100 to-blue-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-cyan-700">Why Choose MindEase?</h2>
          <p className="text-gray-500 mt-3 text-lg">Empathy, Trust & Technology — all in one place</p>
        </div>

        <div className="flex flex-wrap justify-center gap-10 px-6">
          {[
            {
              title: 'Certified Experts',
              desc: 'Connect instantly with licensed, compassionate mental health professionals.',
              icon: '🧑‍⚕️'
            },
            {
              title: 'AI Support 24/7',
              desc: 'Our AI assistant is available anytime to provide emotional first aid and guidance.',
              icon: '🤖'
            },
            {
              title: 'Confidential Sessions',
              desc: 'We value your privacy with secure, anonymous consultations and data protection.',
              icon: '🔒'
            },
            {
              title: 'Mood Tracking',
              desc: 'Track your emotions and mental state with beautiful visual insights.',
              icon: '📈'
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="w-72 bg-white shadow-xl rounded-3xl flex flex-col justify-center items-center text-center p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-cyan-200 hover:border-cyan-400"
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <h3 className="text-xl font-semibold text-cyan-700 mb-3">{card.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>


      <section className="py-20 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <img
          src={services}
          alt="Services"
          className="md:w-1/2 rounded-full shadow-2xl p-14 bg-white hover:scale-105 transition-all duration-500"
        />
        <div className="md:w-1/2 space-y-6">
          <h3 className="text-3xl font-bold text-cyan-700">Holistic Mental Health Services</h3>
          <p className="text-gray-600 leading-relaxed text-lg">
            From therapy to guided meditations, we’re redefining mental health support through technology — confidential, convenient, and caring.
          </p>
          <Link to="/learn-more">
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white text-base rounded-full px-7 py-3 shadow-md">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      
      <section className="relative py-24 overflow-hidden bg-gradient-to-r from-cyan-50  to-blue-100 ">
  <div className="absolute inset-0 "></div>
  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent blur-3xl"></div>

  <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12 text-white">

    <div className="md:w-1/2 space-y-6 ">
      <div className="inline-block bg-white/20 text-gray-700 px-4 py-1 text-sm font-medium rounded-full backdrop-blur-md border border-white/30 shadow-sm">
        💻 Online Appointments
      </div>

      <h3 className="text-4xl font-extrabold leading-snug text-gray-700">
        Book <span className="text-yellow-500">Secure Video Sessions</span> <br />
        with Certified Counselors
      </h3>

      <p className="text-lg text-gray-700 leading-relaxed">
        Get connected with trusted mental health professionals anytime, anywhere.  
        Experience <span className="font-semibold text-green-500">private and effective counseling</span> in a few clicks —  
        all from the comfort of your home.
      </p>

      <div className="flex gap-4 flex-wrap">
        <Link to={`/doctors`}>
        
        <Button className="bg-white text-cyan-700 hover:bg-cyan-50 rounded-full px-8 py-3 font-semibold shadow-xl transition-all hover:scale-105">
          Explore More
        </Button>
        </Link>
        
      </div>
    </div>

    <div className="md:w-1/2 relative flex justify-center">
      <div className="absolute -inset-10 bg-cyan-300/20 blur-3xl rounded-full"></div>
      <img
        src={ourspeciality}
        alt="Doctor Consultation"
        className="w-80 md:w-96 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500 border-4 border-white/20 backdrop-blur-sm"
      />
    </div>
  </div>
</section>


      <section className="py-24 bg-gradient-to-r from-blue-50 to-cyan-100">
        <h2 className="text-center text-4xl font-bold text-cyan-700 mb-10">
          Voices of Our Users 💬
        </h2>

        {/* Add Review */}
        <div className="max-w-4xl mx-auto mb-16 bg-white shadow-2xl rounded-3xl p-8">
          <form onSubmit={handleAddReview} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Your Name"
              className="flex-1 border border-cyan-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="text"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review..."
              className="flex-1 border border-cyan-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full px-8 py-3">
              Submit
            </Button>
          </form>
        </div>

        {/* Reviews */}
        <div className="flex flex-wrap justify-center gap-8 px-6">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="w-72 bg-white p-6 rounded-2xl shadow-xl border border-cyan-100 hover:shadow-2xl hover:scale-105 transition-all"
            >
              <p className="text-gray-700 italic mb-3 leading-relaxed">“{r.content}”</p>
              <p className="text-cyan-700 font-semibold text-md">— {r.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-cyan-50 to-blue-100">
        <h2 className="text-center text-4xl font-bold text-cyan-700 mb-12">Meet Our Counselors</h2>
        <div className="flex flex-wrap justify-center gap-10 mb-10">
          {doctors.map((d) => (
            <div
              key={d._id}
              className="w-64 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center"
            >
              <div className="w-28 h-28 mb-4 rounded-full overflow-hidden border-4 border-cyan-500 shadow-md">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-800">Dr. {d.name}</h3>
              <p className="text-gray-500 text-sm mt-1">Specialist: {d.specialization}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            className="bg-cyan-600 hover:bg-cyan-700 text-white text-base rounded-full px-8 py-3 shadow-md"
            onClick={seeAllDoctors}
          >
            See All Counselors
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Body;
