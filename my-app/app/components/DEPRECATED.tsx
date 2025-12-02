// THIS CODE IS DEPRECATED
// it was the old eventcard list component, does not work with API
// houses the old animations that we might want to reimplement
// once we get the animations down, we can delete this file!

'use client'

import { useState, useEffect } from 'react';
import { Input, Card, Row, Col, Tag, Tooltip, message } from 'antd';
import { SearchOutlined, UserOutlined, FireOutlined, CheckCircleOutlined, ClockCircleOutlined, StopOutlined } from '@ant-design/icons';
import { useSupabaseAuth } from '../lib/SupabaseProvider';

const { Search } = Input;

const sparkEvents = [
  {
    id: 1,
    title: "Pizza Night Leftovers",
    org: "Computer Science Club",
    description: "We've got extra cheese and veggie pizza from tonight's coding meetup. Come grab a slice before it's gone!",
    location: "Center of Computing and Data Science Lobby",
    time: "Today, 8:00 PM - 9:00 PM",
    category: "pizza",
    color: "#dc2626",
    totalSeats: 20,
    reservedSeats: 18,
    availability: "low"
  },
  {
    id: 2,
    title: "Sushi & Study Rolls",
    org: "Asian Student Association",
    description: "Fresh California rolls and veggie sushi left over from our study night. Bring your own container!",
    location: "George Sherman Union Entrance",
    time: "Tomorrow, 6:30 PM - 7:15 PM",
    category: "sushi",
    color: "#2563eb",
    totalSeats: 15,
    reservedSeats: 5,
    availability: "high"
  },
  {
    id: 3,
    title: "Morning Bagel Giveaway",
    org: "Business Analytics Society",
    description: "Extra bagels and cream cheese from our breakfast session. Grab some before class starts!",
    location: "Questroom Lobby, 1st Floor",
    time: "Tomorrow, 9:00 AM - 10:00 AM",
    category: "bagels",
    color: "#ca8a04",
    totalSeats: 30,
    reservedSeats: 25,
    availability: "medium"
  },
  {
    id: 4,
    title: "Donuts",
    org: "International Students Org",
    description: "Donuts from Krispy Kreme available, plain glazed flavor",
    location: "Outside Marsh Chapel",
    time: "Friday, 7:00 PM - 8:00 PM",
    category: "donuts",
    color: "#7c3aed",
    totalSeats: 25,
    reservedSeats: 25,
    availability: "out"
  },
];

// Food type color mapping
const foodColors = {
  pizza: "#dc2626",
  sushi: "#2563eb",
  bagels: "#ca8a04",
  donuts: "#7c3aed",
  default: "#6b7280"
};

// Enhanced availability config with animations
const availabilityConfig = {
  high: { 
    color: "#10b981", 
    label: "Plenty Available", 
    icon: CheckCircleOutlined,
    bgGradient: "from-green-500/20 to-green-600/10",
    borderColor: "border-green-500/30",
    pulseColor: "bg-green-500",
    animation: "animate-pulse-slow"
  },
  medium: { 
    color: "#f59e0b", 
    label: "Limited Spots", 
    icon: ClockCircleOutlined,
    bgGradient: "from-yellow-500/20 to-yellow-600/10",
    borderColor: "border-yellow-500/30",
    pulseColor: "bg-yellow-500",
    animation: "animate-pulse-medium"
  },
  low: { 
    color: "#ef4444", 
    label: "Almost Gone!", 
    icon: FireOutlined,
    bgGradient: "from-red-500/20 to-red-600/10",
    borderColor: "border-red-500/30",
    pulseColor: "bg-red-500",
    animation: "animate-pulse-fast"
  },
  out: { 
    color: "#6b7280", 
    label: "Fully Reserved", 
    icon: StopOutlined,
    bgGradient: "from-gray-500/20 to-gray-600/10",
    borderColor: "border-gray-500/30",
    pulseColor: "bg-gray-500",
    animation: ""
  }
};

export default function EventCards() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [animatedCards, setAnimatedCards] = useState<number[]>([]);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    // Trigger entrance animations
    const timer = setTimeout(() => {
      setAnimatedCards(sparkEvents.map(event => event.id));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const categories = [...new Set(sparkEvents.map(event => event.category))];

  const filteredEvents = sparkEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.org.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFoodColor = (category: string) => {
    return foodColors[category as keyof typeof foodColors] || foodColors.default;
  };

  const getAvailabilityInfo = (availability: string) => {
    return availabilityConfig[availability as keyof typeof availabilityConfig] || availabilityConfig.medium;
  };

  const calculatePercentage = (reserved: number, total: number) => {
    return Math.round((reserved / total) * 100);
  };

  const handleReserve = (event: any) => {
    if (!user) {
      message.error('Please sign in to reserve your spot!');
      return;
    }

    if (event.availability === 'out') {
      message.warning('This event is fully reserved!');
      return;
    }

    // Simulate reservation process
    message.success(`Successfully reserved your spot for ${event.title}!`);
    
    // In a real app, you would update the reservation count here
    console.log(`Reserved: ${event.title}`);
  };

  // Animated Progress Bar Component
  const AnimatedProgressBar = ({ percentage, color, className = "" }: { percentage: number; color: string; className?: string }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        setWidth(percentage);
      }, 300);
      return () => clearTimeout(timer);
    }, [percentage]);

    return (
      <div className={`h-2 bg-gray-700 rounded-full overflow-hidden ${className}`}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            backgroundColor: color,
          }}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add custom animations to global CSS */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes pulse-medium {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-pulse-medium {
          animation: pulse-medium 2s ease-in-out infinite;
        }
        .animate-pulse-fast {
          animation: pulse-fast 1s ease-in-out infinite;
        }
        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
        }
      `}</style>

      {/* Search Bar - Centered */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-2xl">
          <Search
            placeholder="Search events, organizations, or locations..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Category Filters - Centered */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <Tag
          color={!selectedCategory ? 'blue' : 'default'}
          onClick={() => setSelectedCategory('')}
          className="cursor-pointer px-4 py-1 text-sm transition-all duration-300 hover:scale-105"
        >
          All
        </Tag>
        {categories.map(category => (
          <Tag
            key={category}
            color={selectedCategory === category ? getFoodColor(category) : 'default'}
            onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
            className="cursor-pointer px-4 py-1 text-sm capitalize transition-all duration-300 hover:scale-105"
            style={selectedCategory === category ? { 
              backgroundColor: getFoodColor(category), 
              color: 'white',
              border: 'none'
            } : {}}
          >
            {category}
          </Tag>
        ))}
      </div>

      {/* Events Grid */}
      <Row gutter={[16, 16]}>
        {filteredEvents.map((event, index) => {
          const availabilityInfo = getAvailabilityInfo(event.availability);
          const percentage = calculatePercentage(event.reservedSeats, event.totalSeats);
          const seatsLeft = event.totalSeats - event.reservedSeats;
          const IconComponent = availabilityInfo.icon;
          const isAnimated = animatedCards.includes(event.id);

          return (
            <Col xs={24} sm={12} lg={8} key={event.id}>
              <div 
                className={`relative transition-all duration-500 ${isAnimated ? 'animate-slide-in-up' : 'opacity-0'} hover-lift`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Availability Glow Effect */}
                <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${availabilityInfo.bgGradient} blur-sm opacity-50 transition-all duration-300`} />
                
                <Card
                  title={
                    <div className="text-white font-semibold text-lg flex items-center justify-between">
                      <span>{event.title}</span>
                      <Tooltip title={availabilityInfo.label}>
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${availabilityInfo.borderColor} transition-all duration-300 hover:scale-105 ${
                          event.availability === 'high' ? 'bg-green-900/50 text-green-300' :
                          event.availability === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                          event.availability === 'low' ? 'bg-red-900/50 text-red-300' :
                          'bg-gray-700/50 text-gray-300'
                        }`}>
                          <IconComponent className={`text-sm ${event.availability === 'low' ? 'animate-bounce-subtle' : ''}`} />
                          <span>{seatsLeft} left</span>
                        </div>
                      </Tooltip>
                    </div>
                  }
                  bordered={false}
                  className="h-full bg-gray-900 border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 relative z-10"
                  styles={{
                    header: { 
                      borderColor: '#374151', 
                      backgroundColor: '#1f2937',
                      borderBottom: '1px solid #374151'
                    },
                    body: { 
                      backgroundColor: '#111827',
                      color: 'white'
                    }
                  }}
                >
                  <div className="space-y-4 relative z-20">
                    {/* Category and Availability Row */}
                    <div className="flex justify-between items-start">
                      <Tag 
                        color={getFoodColor(event.category)}
                        className="capitalize px-3 py-1 border-none text-white font-medium transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: getFoodColor(event.category) }}
                      >
                        {event.category}
                      </Tag>
                      
                      <div className="text-right">
                        <div className={`text-xs font-semibold flex items-center gap-1 transition-all duration-300 ${
                          event.availability === 'high' ? 'text-green-400' :
                          event.availability === 'medium' ? 'text-yellow-400' :
                          event.availability === 'low' ? 'text-red-400 animate-pulse' :
                          'text-gray-400'
                        }`}>
                          <IconComponent className="text-sm" />
                          {availabilityInfo.label}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {event.reservedSeats}/{event.totalSeats} reserved
                        </div>
                      </div>
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="space-y-2">
                      <AnimatedProgressBar 
                        percentage={percentage} 
                        color={availabilityInfo.color}
                        className="transition-all duration-500"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Empty</span>
                        <span className="font-medium">Availability</span>
                        <span>Full</span>
                      </div>
                    </div>

                    {/* Event Details */}
                    <p className="text-gray-200 leading-relaxed transition-all duration-300 hover:text-gray-100">
                      {event.description}
                    </p>
                    
                    <div className="text-sm space-y-2">
                      <p className="text-gray-300 transition-all duration-300 hover:text-gray-200">
                        <strong className="text-gray-400">Organization:</strong> {event.org}
                      </p>
                      <p className="text-gray-300 transition-all duration-300 hover:text-gray-200">
                        <strong className="text-gray-400">Location:</strong> {event.location}
                      </p>
                      <p className="text-gray-300 transition-all duration-300 hover:text-gray-200">
                        <strong className="text-gray-400">Time:</strong> {event.time}
                      </p>
                    </div>

                    {/* Reserve Button with Auth Check */}
                    <Tooltip title={!user ? "Please sign in to reserve" : event.availability === 'out' ? "Fully reserved" : "Click to reserve"}>
                      <button
                        onClick={() => handleReserve(event)}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden group ${
                          event.availability === 'out' || !user
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                            : `bg-gradient-to-r ${event.availability === 'high' ? 'from-green-600 to-green-500' : event.availability === 'medium' ? 'from-yellow-600 to-yellow-500' : 'from-red-600 to-red-500'} hover:scale-105 hover:shadow-lg text-white cursor-pointer`
                        }`}
                        disabled={event.availability === 'out' || !user}
                      >
                        {/* Button Shine Effect */}
                        {event.availability !== 'out' && user && (
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        )}
                        
                        {!user ? (
                          <span className="flex items-center justify-center gap-2">
                            <UserOutlined />
                            Sign In to Reserve
                          </span>
                        ) : event.availability === 'out' ? (
                          <span className="flex items-center justify-center gap-2">
                            <StopOutlined />
                            Fully Reserved
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2 relative">
                            <UserOutlined />
                            Reserve Your Spot
                            {event.availability === 'low' && (
                              <FireOutlined className="animate-bounce-subtle ml-1" />
                            )}
                          </span>
                        )}
                      </button>
                    </Tooltip>
                  </div>
                </Card>
              </div>
            </Col>
          );
        })}
      </Row>

      {filteredEvents.length === 0 && (
        <div className="text-center text-gray-400 py-12 animate-slide-in-up">
          <p className="text-lg mb-2">No events found matching your criteria.</p>
          <p className="text-sm">Try different search terms or clear the category filter.</p>
        </div>
      )}
    </div>
  );
}
