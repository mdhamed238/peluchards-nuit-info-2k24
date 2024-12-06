import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Camera, Droplet, CloudRain, FileDownIcon } from "lucide-react";

const Welcome = () => {
  // Sample data for the parallels between human body and ocean
  const parallels = [
    {
      organ: "Heart",
      oceanProcess: "Circulatory System (Ocean Currents)",
      description:
        "The ocean's circulatory system, driven by the thermohaline circulation, is like the human heart, pumping water around the globe.",
    },
    {
      organ: "Lungs",
      oceanProcess: "Gas Exchange (Photosynthesis)",
      description:
        "The ocean's phytoplankton perform photosynthesis, absorbing carbon dioxide and releasing oxygen, similar to how human lungs facilitate gas exchange.",
    },
    {
      organ: "Skin",
      oceanProcess: "Temperature Regulation",
      description:
        "The ocean plays a crucial role in regulating the Earth's temperature, just as the human skin helps maintain a stable body temperature.",
    },
    {
      organ: "Kidneys",
      oceanProcess: "Salinity Regulation",
      description:
        "The ocean's salinity levels are carefully balanced, much like the human kidneys regulate fluid and salt levels in the body.",
    },
  ];

  // Sample data for the climate regulation chart
  const climateData = [
    { name: "1950", temperature: 13.9, seaLevel: 3.2 },
    { name: "1960", temperature: 14.0, seaLevel: 3.4 },
    { name: "1970", temperature: 14.1, seaLevel: 3.6 },
    { name: "1980", temperature: 14.3, seaLevel: 3.8 },
    { name: "1990", temperature: 14.6, seaLevel: 4.0 },
    { name: "2000", temperature: 14.8, seaLevel: 4.3 },
    { name: "2010", temperature: 15.0, seaLevel: 4.6 },
    { name: "2020", temperature: 15.2, seaLevel: 4.9 },
  ];

  return (
    <div className='max-w-6xl mx-auto text-center px-4 py-12'>
      <h1 className='text-5xl font-bold text-blue-900 mb-8'>
        Ocean Life
        <span className='block text-2xl font-medium text-blue-600 mt-2'>
          Learn · Share · Act
        </span>
      </h1>
      <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left'>
        <div className='bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow'>
          <h2 className='text-xl font-semibold text-blue-800 mb-3'>
            <Camera size={32} className='inline-block mr-2' />
            Learn
          </h2>
          <p className='text-gray-600'>
            Explorez les parallèles fascinants entre l'océan et le corps humain
            à travers nos quiz interactifs et ressources éducatives.
          </p>
        </div>
        <div className='bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow'>
          <h2 className='text-xl font-semibold text-blue-800 mb-3'>
            <Droplet size={32} className='inline-block mr-2' />
            Share
          </h2>
          <p className='text-gray-600'>
            Partagez vos connaissances et participez à la sensibilisation sur
            l'importance de préserver nos océans.
          </p>
        </div>
        <div className='bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow'>
          <h2 className='text-xl font-semibold text-blue-800 mb-3'>
            <CloudRain size={32} className='inline-block mr-2' />
            Act
          </h2>
          <p className='text-gray-600'>
            Découvrez comment agir concrètement pour la protection des océans et
            participez à notre mission.
          </p>
        </div>
      </div>
      <div className='mt-16 max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          Parallèles entre l'Océan et le Corps Humain
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {parallels.map((parallel, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
                  {parallel.organ} ↔ {parallel.oceanProcess}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>{parallel.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className='mt-16 max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          Régulation du Climat par l'Océan
        </h2>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={climateData}>
            <XAxis dataKey='name' />
            <YAxis
              yAxisId='left'
              type='number'
              domain={[13.5, 15.5]}
              label={{
                value: "Température (°C)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <YAxis
              yAxisId='right'
              type='number'
              domain={[3, 5]}
              orientation='right'
              label={{
                value: "Niveau de la Mer (cm)",
                angle: 90,
                position: "insideRight",
              }}
            />
            <CartesianGrid strokeDasharray='3 3' />
            <Tooltip />
            <Legend />
            <Line
              yAxisId='left'
              type='monotone'
              dataKey='temperature'
              stroke='#8884d8'
            />
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='seaLevel'
              stroke='#82ca9d'
            />
          </LineChart>
        </ResponsiveContainer>
        <div className='mt-6 text-right'>
          <a
            href='/download'
            className='inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors'
          >
            <FileDownIcon size={20} className='mr-2' />
            Télécharger les données
          </a>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
