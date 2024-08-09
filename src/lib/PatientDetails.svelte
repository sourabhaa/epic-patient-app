<script lang="ts">
  import axios from "axios";
  import { FHIR_BASE_URL } from "../config";
  import type { Patient } from "fhir/r4";
  import { UserCircleOutline} from "flowbite-svelte-icons";
  import { Button } from "flowbite-svelte";
  import FemaleIcon from '../assets/whacky_female.png'
  import MaleIcon from '../assets/whacky_male.png'

  export let accessToken: string;
  export let patientId: string;

  const getPatientDetails = async () => {
      const patientResponse = await axios.get<Patient>(
          `${FHIR_BASE_URL}/Patient/${patientId}`,
          {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          },
      );
      return patientResponse.data;
  };
</script>

<!-- <div class="mt-10 max-w-md mx-auto"> -->
  <div class="bg-accent-red text-white p-6 m-4 mr-5 lg:p-3 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
 
   
  {#await getPatientDetails()}
      loading...
  {:then patient}
   <!-- Avatar icon -->
   <div class="flex items-center mb-2 md:mb-0">
    <Button>
      {#if patient?.gender === 'male'}
      <img src={MaleIcon} alt="Patient" height="125" width="125" />
      {/if}
      {#if patient?.gender === 'female'}
      <img src={FemaleIcon} alt="Patient" height="125" width="125"/>
      {/if}
    </Button>
    </div>
  <div class="flex-1">
        <h2 class="text-3xl lg:text-2xl xl:text-3xl font-bold">{patient?.name?.[0]?.given?.[0]} {patient?.name?.[0]?.family}</h2>
        <p>
          <span class="font-semibold">Epic identifier:</span>
          {patient?.identifier?.find(
              (i) =>
                  i.system === "urn:oid:1.2.840.114350.1.13.0.1.7.5.737384.0",
          )?.value}
      </p>
      <p>
        <span class="font-semibold">Date of birth:</span>
        {patient?.birthDate}
    </p>
      </div>
    <!-- </div> -->
    
    <div class="mt-4 md:mt-0 text-left md:text-right font-bold mr-6">
      <p>
        <span class="font-semibold">External identifier:</span>
        {patient?.identifier?.find(
            (i) =>
                i.system === "urn:oid:1.2.840.114350.1.13.0.1.7.2.698084",
        )?.value}
    </p>
    <p>
      <span class="font-semibold">Gender:</span>
      <span class="capitalize">{patient?.gender}</span>
  </p>
    </div>
  {/await}
</div>

