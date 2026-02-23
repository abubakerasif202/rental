import React, { useEffect, useState } from "react";
import { VehicleStatus, Vehicle, Rental } from "../types";
import { useLoading } from "../context/LoadingContext";
import RentalClosureModal from "./RentalClosureModal";

// Modular Components
import StatCards from "./dashboard/StatCards";
import RevenueChart from "./dashboard/RevenueChart";
import ActionCenter from "./dashboard/ActionCenter";
import FleetStatusTable from "./dashboard/FleetStatusTable";
import PastRentalsTable from "./dashboard/PastRentalsTable";
import MaintenanceCenter from "./dashboard/MaintenanceCenter";
import RecentActivity from "./dashboard/RecentActivity";
import QuickActions from "./dashboard/QuickActions";

const Dashboard: React.FC = () => {
  const { withLoading } = useLoading();
  
  // Data State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [makeFilter, setMakeFilter] = useState<string>("All");
  const [modelFilter, setModelFilter] = useState<string>("All");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");
  const [selectedVehicleForClosure, setSelectedVehicleForClosure] =
    useState<Vehicle | null>(null);
  const [selectedRentalForClosure, setSelectedRentalForClosure] =
    useState<Rental | null>(null);
  const [expandedVehicleId, setExpandedVehicleId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [vehiclesRes, rentalsRes, alertsRes] = await Promise.all([
        fetch("/api/vehicles"),
        fetch("/api/rentals"),
        fetch("/api/alerts")
      ]);

      if (vehiclesRes.ok) setVehicles(await vehiclesRes.json());
      if (rentalsRes.ok) setRentals(await rentalsRes.json());
      if (alertsRes.ok) setAlerts(await alertsRes.json());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    withLoading(fetchData);
  }, []);

  const handleRefresh = async () => {
    await withLoading(async () => {
      await fetchData();
      // Simulate extra delay for UX if needed, or rely on fetch time
      await new Promise((resolve) => setTimeout(resolve, 500));
    });
  };

  // Calculations
  const activeRentalsCount = rentals.filter(
    (r) => r.status === "Active",
  ).length;
  const overdueRentals = rentals.filter((r) => r.status === "Late");
  
  const utilizationRate = vehicles.length > 0 
    ? Math.round((vehicles.filter((v) => v.status === VehicleStatus.RENTED).length / vehicles.length) * 100)
    : 0;
    
  const paymentFailures = alerts.filter(
    (a) => a.type === "payment_failure",
  ).length;

  // Filter Logic
  const uniqueMakes = Array.from(
    new Set(vehicles.map((v) => v.make)),
  ).sort();
  const uniqueModels = Array.from(
    new Set(vehicles.map((v) => v.model)),
  ).sort();

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || vehicle.status === statusFilter;
    const matchesMake = makeFilter === "All" || vehicle.make === makeFilter;
    const matchesModel = modelFilter === "All" || vehicle.model === modelFilter;

    let isAvailableInDateRange = true;
    if (startDateFilter && endDateFilter) {
      const filterStart = new Date(startDateFilter);
      const filterEnd = new Date(endDateFilter);

      const overlappingRentals = rentals.filter((r) => {
        if (r.vehicleId !== vehicle.id) return false;
        if (r.status === "Completed") return false;

        const rentalStart = new Date(r.startDate);
        const rentalEnd = new Date(r.endDate);

        return rentalStart <= filterEnd && rentalEnd >= filterStart;
      });

      isAvailableInDateRange = overlappingRentals.length === 0;
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesMake &&
      matchesModel &&
      isAvailableInDateRange
    );
  });

  const chartData = [
    { name: "Mon", revenue: 2400, utilization: 65 },
    { name: "Tue", revenue: 1398, utilization: 58 },
    { name: "Wed", revenue: 9800, utilization: 82 },
    { name: "Thu", revenue: 3908, utilization: 74 },
    { name: "Fri", revenue: 4800, utilization: 88 },
    { name: "Sat", revenue: 3800, utilization: 92 },
    { name: "Sun", revenue: 4300, utilization: 85 },
  ];

  const handleOpenClosure = (vehicle: Vehicle) => {
    const rental = rentals.find(
      (r) => r.vehicleId === vehicle.id && r.status === "Active",
    );
    if (rental) {
      setSelectedVehicleForClosure(vehicle);
      setSelectedRentalForClosure(rental);
    }
  };

  const handleConfirmClosure = (data: any) => {
    console.log("Closure confirmed:", data);
    setSelectedVehicleForClosure(null);
    setSelectedRentalForClosure(null);
    handleRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <StatCards
        activeRentalsCount={activeRentalsCount}
        utilizationRate={utilizationRate}
        paymentFailures={paymentFailures}
        overdueCount={overdueRentals.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RevenueChart chartData={chartData} onRefresh={handleRefresh} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MaintenanceCenter />
            <RecentActivity />
          </div>
        </div>

        <div className="space-y-6">
          <QuickActions />
          <ActionCenter alerts={alerts} overdueRentals={overdueRentals} />
        </div>
      </div>

      <FleetStatusTable
        vehicles={filteredVehicles}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        makeFilter={makeFilter}
        setMakeFilter={setMakeFilter}
        modelFilter={modelFilter}
        setModelFilter={setModelFilter}
        uniqueMakes={uniqueMakes}
        uniqueModels={uniqueModels}
        startDateFilter={startDateFilter}
        setStartDateFilter={setStartDateFilter}
        endDateFilter={endDateFilter}
        setEndDateFilter={setEndDateFilter}
        onOpenClosure={handleOpenClosure}
        expandedVehicleId={expandedVehicleId}
        setExpandedVehicleId={setExpandedVehicleId}
      />

      <PastRentalsTable rentals={rentals} vehicles={vehicles} />

      {selectedVehicleForClosure && selectedRentalForClosure && (
        <RentalClosureModal
          vehicle={selectedVehicleForClosure}
          rental={selectedRentalForClosure}
          onClose={() => {
            setSelectedVehicleForClosure(null);
            setSelectedRentalForClosure(null);
          }}
          onConfirm={handleConfirmClosure}
        />
      )}
    </div>
  );
};

export default Dashboard;
