import type {
  RelationshipGraph,
  RelationshipNode,
  RelationshipEdge,
  StructuredEntity,
  SemanticClaim,
  RequestedAction,
} from './types';

export function buildRelationshipGraph(
  entities: StructuredEntity[],
  claims: SemanticClaim[],
  actions: RequestedAction[]
): RelationshipGraph {
  const nodes: RelationshipNode[] = [];
  const edges: RelationshipEdge[] = [];

  // 1. Add Entity Nodes
  for (const ent of entities.slice(0, 8)) {
    nodes.push({
      id: ent.id,
      label: `${ent.type}: ${ent.value}`,
      type: ent.type === 'BANK' || ent.type === 'ORGANIZATION' ? 'org' : 'entity',
    });
  }

  // 2. Add Claim Nodes
  for (const clm of claims) {
    nodes.push({
      id: clm.id,
      label: `Claim: ${clm.event}`,
      type: 'claim',
    });
  }

  // 3. Add Action Nodes
  for (const act of actions) {
    nodes.push({
      id: act.id,
      label: `Action: ${act.label}`,
      type: 'action',
    });
  }

  // 4. Connect Claims to Organizations
  const orgEntity = entities.find((e) => e.type === 'BANK' || e.type === 'ORGANIZATION');
  if (orgEntity && claims.length > 0) {
    edges.push({
      from: orgEntity.id,
      to: claims[0].id,
      relation: 'purports_event',
      explanation: `The claim "${claims[0].event}" is made under the identity of ${orgEntity.value}.`,
    });
  }

  // 5. Connect Claims to Amounts
  const amountEntity = entities.find((e) => e.type === 'AMOUNT');
  if (amountEntity && claims.length > 0) {
    edges.push({
      from: claims[0].id,
      to: amountEntity.id,
      relation: 'involves_amount',
      explanation: `The claim involves a stated monetary figure of ${amountEntity.value}.`,
    });
  }

  // 6. Connect Actions to URLs
  const urlEntity = entities.find((e) => e.type === 'URL');
  const linkAction = actions.find((a) => a.actionType === 'LOGIN' || a.actionType === 'CLICK_LINK' || a.actionType === 'VERIFY_ACCOUNT');
  if (urlEntity && linkAction) {
    edges.push({
      from: linkAction.id,
      to: urlEntity.id,
      relation: 'targets_destination',
      explanation: `The requested action directs the recipient to open ${urlEntity.value}.`,
    });
  }

  // Generate relationship summary
  let summary = 'Standard single-party informational document.';
  if (orgEntity && linkAction && claims[0]?.claimType === 'ACCOUNT_LOCKED') {
    summary = `High-correlation risk vector: Brand identity (${orgEntity.value}) is linked to an urgent account lockout claim, which routes to an external destination (${urlEntity?.value || 'external link'}).`;
  } else if (orgEntity && amountEntity && claims[0]?.claimType === 'MONEY_CREDITED') {
    summary = `Financial credit relationship: ${orgEntity.value} notification claiming ${amountEntity.value} balance credit with no outbound link action.`;
  }

  return {
    nodes,
    edges,
    summary,
  };
}
