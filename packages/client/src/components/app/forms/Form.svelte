<script>
  import { getContext } from "svelte"
  import InnerForm from "./InnerForm.svelte"
  import { Helpers } from "@budibase/bbui"

  export let dataSource
  export let theme
  export let size
  export let disabled = false
  export let actionType = "Create"

  // Not exposed as a builder setting. Used internally to disable validation
  // for fields rendered in things like search blocks.
  export let disableValidation = false

  // Not exposed as a builder setting. Used internally to allow searching on
  // auto columns.
  export let editAutoColumns = false

  const context = getContext("context")
  const { API, fetchDatasourceSchema } = getContext("sdk")

  let schema
  let table

  $: fetchSchema(dataSource)
  $: fetchTable(dataSource)

  // Returns the closes data context which isn't a built in context
  const getInitialValues = (type, dataSource, context) => {
    // Only inherit values for update forms
    if (type !== "Update") {
      return {}
    }
    // Only inherit values for forms targeting internal tables
    if (!dataSource?.tableId) {
      return {}
    }
    // Don't inherit values representing built in contexts
    if (["user", "url"].includes(context.closestComponentId)) {
      return {}
    }
    // Always inherit the closest datasource
    const closestContext = context[`${context.closestComponentId}`] || {}
    return closestContext || {}
  }

  // Fetches the form schema from this form's dataSource
  const fetchSchema = async dataSource => {
    schema = (await fetchDatasourceSchema(dataSource)) || {}
  }

  const fetchTable = async dataSource => {
    if (dataSource?.tableId && dataSource?.type !== "query") {
      try {
        table = await API.fetchTableDefinition(dataSource.tableId)
      } catch (error) {
        table = null
      }
    }
  }

  $: initialValues = getInitialValues(actionType, dataSource, $context)
  $: resetKey = Helpers.hashString(
    JSON.stringify(initialValues) + JSON.stringify(dataSource) + disabled
  )
</script>

{#key resetKey}
  <InnerForm
    {dataSource}
    {theme}
    {size}
    {disabled}
    {actionType}
    {schema}
    {table}
    {initialValues}
    {disableValidation}
    {editAutoColumns}
  >
    <slot />
  </InnerForm>
{/key}
