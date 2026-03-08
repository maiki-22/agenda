import {
  listBarbers,
  listServices,
} from "@/features/booking/data/catalog.repo";
import { ReservarClient } from "./ReservarClient";

export default async function ReservarPage() {
  const [services, barbers] = await Promise.all([
    listServices(),
    listBarbers(),
  ]);

  return <ReservarClient initialCatalog={{ services, barbers }} />;
}
