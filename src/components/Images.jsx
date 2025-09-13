import { Carousel } from "react-bootstrap"; // Ensure Bootstrap is installed

function Images() {
  const placesAndJobs = [
    
    {
      img: "https://media.geeksforgeeks.org/wp-content/uploads/20230919110724/Aptitute-Test.webp",
      name: "Aptitude Test",
      des: "Build Logic with  Aptitude Test.",
    },
    {
      img: "https://images.pexels.com/photos/3251851/pexels-photo-3251851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      name: "Tokyo",
      des: "Jobs in AI, Robotics, and Engineering",
    },
    {
      img: "https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      name: "Remote Work",
      des: "Work from anywhere in Software, Writing, and Design",
    },
  ];

  return (
    <div className="w-full  h-[500px]">
      <Carousel  fade>
        {placesAndJobs.map((place, index) => (
          <Carousel.Item  key={index}>
            <img
              src={place.img}
              alt={place.name}
              className="object-cover rounded-2xl border-r-2 border-l-2 w- h-[450px] p-4"
            />
            <Carousel.Caption>
              <h3>{place.name}</h3>
              <p>{place.des}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default Images;
