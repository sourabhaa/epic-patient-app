<script lang="ts">
  import axios from "axios";
  import { FHIR_BASE_URL } from "../config";
  import {formatRelative, subDays} from 'date-fns'
  import type { Bundle, BundleEntry, MedicationRequest, Observation, OperationOutcome } from "fhir/r4";

  export let accessToken: string
  export let patientId: string
  export let category: string = 'laboratory'
  export let title: string = 'Lab Results'

  const getLabResults = async () => {
    const labObservationResponse = await axios.get<Bundle<Observation | OperationOutcome>>(`${FHIR_BASE_URL}/Observation`, {
      params: {
        subject: patientId,
        category,
        sort: '-date'
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return labObservationResponse.data
  }

  const getObservationDisplay = (observation: Observation | undefined) => {
    if (!observation) {
      return ''
    }
    const isBp = observation.code?.coding?.find(a=>a.code === '55284-4')
    if (isBp) {
      const systolicComponent = observation.component?.find(a=>a.code?.coding?.find(b=>b.code==='8480-6'))
      const systolic = systolicComponent?.valueQuantity?.value
      const diastolicComponent = observation.component?.find(a=>a.code?.coding?.find(b=>b.code==='8462-4'))
      const diastolic = diastolicComponent?.valueQuantity?.value
      return `${systolic}/${diastolic}`
    }
    if (!observation?.valueQuantity?.unit) {
      return observation?.valueQuantity?.value
    }
    return `${observation?.valueQuantity?.value} ${observation?.valueQuantity?.unit}`

  }

  const getObservationEntries = (bundle: Bundle<Observation | OperationOutcome>): BundleEntry<Observation>[] => {
    if (!bundle?.entry) {
      return []
    }
    const results = bundle.entry?.filter((entry) => entry.resource?.resourceType === 'Observation') as BundleEntry<Observation>[];
    return results.sort((a,b)=>{
      if (a?.resource?.effectiveDateTime && b?.resource?.effectiveDateTime) {
        return new Date(b?.resource?.effectiveDateTime).getTime() - new Date(a?.resource?.effectiveDateTime).getTime();
      }
      return 0
    })
    
  }
</script>
<div class="mb-5  mx-10">
{#await getLabResults()}
  loading...
{:then labResults} 
  <h1 class="text-2xl my-10">
    {title}
  </h1>
  <div class="table-container overflow-x-auto overflow-y-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="border border-gray-300 px-4 py-2">Observation Name</th>
          <th class="border border-gray-300 px-4 py-2">Observation DateTime</th>
          <th class="border border-gray-300 px-4 py-2">Observation Value</th>
   
        </tr>
      </thead>
      <tbody>
  {#each getObservationEntries(labResults) as observation, i}
  <tr class={i % 2 ? 'bg-gray-50' : 'bg-white'}>
    <td class="border border-gray-300 px-4 py-2">
      {observation.resource?.code?.text}
    </td>
      <td class="border border-gray-300 px-4 py-2"> {#if observation?.resource?.effectiveDateTime} 
        ({formatRelative(new Date(observation?.resource.effectiveDateTime), new Date())})
      {/if}
    </td>
     
      <td class="border border-gray-300 px-4 py-2"> {getObservationDisplay(observation.resource)}
    </td>
  <div class="ml-4">
  </div>
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