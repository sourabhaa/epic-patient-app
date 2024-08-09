<script lang="ts">
  import axios from "axios";
  import { FHIR_BASE_URL } from "../config";
  import type { Bundle, BundleEntry, MedicationRequest, OperationOutcome } from "fhir/r4";

  export let accessToken: string
  export let patientId: string

  const getMedications = async () => {
    const medicationRequestResponse = await axios.get<Bundle<MedicationRequest | OperationOutcome>>(`${FHIR_BASE_URL}/MedicationRequest`, {
      params: {
        subject: patientId
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return medicationRequestResponse.data
  }

  const getMedicationRequestEntries = (bundle: Bundle<MedicationRequest | OperationOutcome>): BundleEntry<MedicationRequest>[] => {
    if (!bundle?.entry) {
      return []
    }
    return bundle.entry?.filter((entry) => entry.resource?.resourceType === 'MedicationRequest') as BundleEntry<MedicationRequest>[]
  }
</script>
<div class="mb-5  mx-10">
{#await getMedications()}
  loading...
{:then medicationList} 
  <h1 class="text-2xl my-10">
    Medication List
  </h1>
  <div class="table-container overflow-x-auto overflow-y-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="border border-gray-300 px-4 py-2">Observation Name</th>
          <th class="border border-gray-300 px-4 py-2">Dosage</th>
          <th class="border border-gray-300 px-4 py-2">Reason</th>
   
        </tr>
      </thead>
      <tbody>
  {#each getMedicationRequestEntries(medicationList) as medication, i}
  <tr class={i % 2 ? 'bg-gray-50' : 'bg-white'}>
    <td class="border border-gray-300 px-4 py-2">
   {medication.resource?.medicationReference?.display}
  </td>

  {#if medication?.resource?.dosageInstruction?.[0]?.patientInstruction}
  <td class="border border-gray-300 px-4 py-2">
    {medication?.resource?.dosageInstruction?.[0]?.patientInstruction}
  </td>
  {/if}
  {#if medication?.resource?.reasonCode?.[0]?.text}
  <td class="border border-gray-300 px-4 py-2">
    {medication?.resource?.reasonCode?.[0]?.text}
  </td>
  {/if}

  {/each}
</tbody>
</table>
</div>
{/await}
</div>



<style>
  .table-container {
    max-height: 60vh; /* Adjust the height as needed */
    overflow-y: auto;
  }
  thead th {
    position: sticky;
    top: 0;
    background-color: #e8e8fd; /* Match with your design's header background color */
    z-index: 1; /* Ensure it stays above table rows */
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 12px;
    text-align: left;
  }
  th {
    font-weight: 600;
    color: #4b5563; /* Header text color */
  }
  tbody tr:hover {
    background-color: #f8f8ff; /* Row hover effect */
  }
</style>