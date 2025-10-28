import { Card  } from "antd";

const sparkEvents = [
    {
      id: 1,
      title: "Pizza Night Leftovers",
      org: "Computer Science Club",
      description:
        "We’ve got extra cheese and veggie pizzas from tonight’s coding meetup. Come grab a slice before it’s gone!",
      location: "Center of Computing and Data Science Lobby",
      time: "Today, 8:00 PM - 9:00 PM",

    },
    {
      id: 2,
      title: "Sushi & Study Rolls",
      org: "Asian Student Association",
      description:
        "Fresh California rolls and veggie sushi left over from our study night. Bring your own container!",
      location: "George Sherman Union Entrance",
      time: "Tomorrow, 6:30 PM - 7:15 PM",

    },
    {
      id: 3,
      title: "Morning Bagel Giveaway",
      org: "Business Analytics Society",
      description:
        "Extra bagels and cream cheese from our breakfast session. Grab some before class starts!",
      location: "Questroom Lobby, 1st Floor",
      time: "Tomorrow, 9:00 AM - 10:00 AM",

    },
    {
      id: 4,
      title: "Donuts",
      org: "International Students Org",
      description:
        "Donuts from krispy kreme available, plain glazed flavor",
      location: "Outside Marsh Chapel",
      time: "Friday, 7:00 PM - 8:00 PM",
 
    },
    {
      id: 5,
      title: "Coffee & Cookies ",
      org: "Psychology Department",
      description:
        "Freshly brewed coffee and leftover cookies from our research open house — chill and grab a treat!",
      location: "George Sherman Union Entrance",
      time: "Friday, 3:00 PM - 4:30 PM",

    },
  ];

export default function EventCards() {
  return (
    <div className="flex flex-wrap gap-6 justify-center p-6">
      {sparkEvents.map((event) => (
        <Card
          key={event.id}
          title={event.title}
          
          styles={{
            header: {color: "#D4AF37",
            fontWeight: 600,
            fontSize: "1.1rem"}
          }}
          style={{
            border: 0,
            width: 300,
            background: "linear-gradient(145deg, #1C1D17, #2C2D25)",
            color: "#E5E5E5",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
          }}
        >
          <p><strong>Hosted by:</strong> {event.org}</p>
          <br></br>
          <p>{event.description}</p>
          <br></br>
          <p><strong>📍 {event.location}</strong></p>
          <p><strong>🕒 {event.time}</strong></p>
        </Card>
      ))}
    </div>
  );
}
