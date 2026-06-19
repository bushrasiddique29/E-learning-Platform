import "./testimonial.css";

const Testimonial = () => {
    const testimonialsData = [
    {
      id: 1,
      name: "John Doe",
      position: "Student",
      message:
        "This platform helped me learn so effectively. The courses are amazing and the instructors are top-notch.",
      image:
        "https://th.bing.com/th?q=Current+Bachelor&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247",
    },
    {
      id: 2,
      name: "Arhama Siddique",
      position: "Student",
      message:
        "I've learned more here than in any other place. The interactive lessons and quizzes make learning enjoyable.",
      image:
        "https://images.unsplash.com/photo-1618355776464-8666794d2520?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3R1ZGVudCUyMHBpY3xlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 3,
      name: "Zoya Parveen",
      position: "Student",
      message:
        "This platform helped me learn so effectively. The courses are amazing and the instructors are top-notch.",
      image:
        "https://media.istockphoto.com/id/1326088633/photo/portrait-of-young-women-student-standing-isolated-over-yellow-background-stock-photo.webp?a=1&b=1&s=612x612&w=0&k=20&c=3s26KWQES8VAMubf7OK5dfZzq1dWxHYfYJUYGC1eV4E=",
    },
    {
      id: 4,
      name: "Muskan Siddique",
      position: "Student",
      message:
        "I've learned more here than in any other place. The interactive lessons and quizzes make learning enjoyable.",
      image: "https://plus.unsplash.com/premium_photo-1661434380261-ca9305950dd3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c3R1ZGVudCUyMHBpY3xlbnwwfHwwfHx8MA%3D%3D",
    },
  ];
  return (
    <>
     <section className="testimonials">
      <h2>What our students say</h2>
      <div className="testmonials-cards">
        {testimonialsData.map((e) => (
          <div className="testimonial-card" key={e.id}>
            <div className="student-image">
              <img src={e.image} alt="" />
            </div>
            <p className="message">{e.message}</p>
            <div className="info">
              <p className="name">{e.name}</p>
              <p className="position">{e.position}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
    </>
  )
}

export default Testimonial