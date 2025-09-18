---
sidebar_position: 1
---

# Contract v1 → v2 Migration Guide
## Universal Guide for Migrating Any Project

---

## 🎯 **Objective**
This universal guide helps developers migrate **any project** from Contract v1 to v2, based on best practices and common errors identified during real migrations.

### **📝 Creation Context**
This guide was created **in parallel** with a real migration, documenting:
- Data format changes
- Technical problems encountered
- Applied solutions
- Project-specific custom queries

### **⚠️ Limitations**
- The provided examples do **not constitute an exhaustive list**
- Each project may have its specificities
- Some queries may require adaptations according to your context

### **🤖 AI Support and Context**
This guide strongly recommends creating a `migration-resources/` folder containing (see prerequisites):
- **Old contract ABI**
- **GraphQL Schema**
- **Migration journal** with queries and responses
- **Custom migration plan**

**Why?** These resources allow you to provide **complete context** to an AI agent, significantly facilitating the migration process and resolution of project-specific issues.

---

## 📝 **Migration Plan Template**

```markdown
# Contract v1 → v2 Migration Plan - [PROJECT_NAME]

## Phase A: Analysis ✅
- [ ] Identify used endpoints
- [ ] List GraphQL types
- [ ] Analyze architecture

## Phase B: Endpoint Migration ✅
- [ ] Update URLs
- [ ] Test connectivity

## Phase C: Query Migration ✅
- [ ] Adapt identifiers
- [ ] Change variable types
- [ ] Replace relations

## Phase D: Component Migration ✅
- [ ] Migrate hooks
- [ ] Adapt components
- [ ] Update interfaces

## Phase E: Testing and Validation ✅
- [ ] Unit tests
- [ ] Integration tests
- [ ] End-to-end tests
```

---

## 📚 **Prerequisites: Create Your Reference Files**

### **1. Get the New ABI:**
```bash
# Download the v2 contract ABI from your source
```

### **2. Before starting your migration, create these reference files in a `migration-resources/` folder:**

#### **2.1 Create a Copy of the Old Contract:**
```bash
# Backup the old contract ABI
# Save in: migration-resources/old-contract.doc
```

#### **2.2 Get the GraphQL v2 Schema:**
Run this command to get the complete schema:
```bash
curl -X POST "https://testnet.intuition.sh/v1/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __schema { types { name fields { name type { name kind ofType { name kind } } } } } }"}'
```
  > Copy the response to migration-resources/schema-graph.doc

#### **2.3 Create a Migration Journal:**
```bash
# Create: migration-resources/useful-queries-responses.doc
# Document your v1 vs v2 queries, encountered errors, solutions
```

#### **2.4 Create a Migration Plan:**
```bash
# Create: migration-resources/migration-plan-[YOUR_PROJECT].md
# Adapt the provided template to your project
# 1h of preparation = 10h saved later
```

---

## 📋 **Universal Migration Checklist**

### **Phase 1: Preparation**
- [ ] **Analyze** current project architecture
- [ ] **Identify** all GraphQL endpoints used
- [ ] **List** all GraphQL types (atoms, terms, triples, etc.)
- [ ] **Consult** v2 schema to understand changes
- [ ] **Create** a structured migration plan → migration-resources/migration-plan-[YOUR_PROJECT].md
- [ ] **Backup** existing code (backup branch)

### **Phase 2: Endpoint Migration**
- [ ] **Update** endpoint URLs
- [ ] **Verify** network compatibility (mainnet/testnet)
- [ ] **Test** connectivity with new endpoints
- [ ] **Validate** that endpoints respond correctly

### **Phase 3: GraphQL Query Migration**
- [ ] **Adapt** identifiers (`id` → `term_id`)
- [ ] **Change** variable types (`numeric` → `String`)
- [ ] **Replace** removed relations (`vaults` → `terms`)
- [ ] **Update** removed fields (`position_count` → `positions_aggregate`)
- [ ] **Test** each query individually

### **Phase 4: Hooks/Components Migration**
- [ ] **Migrate** data fetching hooks
- [ ] **Adapt** display components
- [ ] **Update** TypeScript interfaces
- [ ] **Test** component rendering

### **Phase 5: Smart Contracts Migration**
- [ ] **Verify** ABI compatibility
- [ ] **Adapt** function calls (`depositTriple` → `depositBatch`)
- [ ] **Update** data types (`BigInt` → `0x...` string)
- [ ] **Test** contract interactions

### **Phase 6: Testing and Validation**
- [ ] **Unit tests** for each migrated component
- [ ] **Integration tests** with smart contracts
- [ ] **End-to-end tests** of complete workflow
- [ ] **Error handling** and failure cases

---

## 🔄 **Universal Schema Changes**

### **Identifiers (ID Fields):**
```typescript
// ❌ v1 (Old)
atoms: { id: string }
triples: { id: string }

// ✅ v2 (New)
atoms: { term_id: string }
triples: { term_id: string }
terms: { id: string } // Remains unchanged
```

### **Relations (Relationships):**
```typescript
// ❌ v1 (Old)
vaults → terms
claims → triples

// ✅ v2 (New)
terms (replaces vaults)
triples (replaces claims)
```

### **Removed Fields:**
```typescript
// ❌ v1 (Old)
position_count: number
total_shares: number
block_timestamp: string

// ✅ v2 (New)
positions_aggregate: { aggregate: { count: number } }
total_market_cap: number
created_at: string
```

### **Variable Types:**
```typescript
// ❌ v1 (Old)
$id: numeric!
$tripleId: numeric!

// ✅ v2 (New)
$id: String!
$tripleId: String!
```

---

## 🛠️ **Universal Debug Method**

### **1. Systematic Debug Logs:**
```typescript
// Add to each query/hook
console.log("🔍 GraphQL Query:", query);
console.log("📊 Variables:", variables);
console.log("📡 Response:", result);
console.log("❌ Error:", error);
```

### **2. Step-by-Step Testing:**
```typescript
// Start with a simple query
const simpleQuery = gql`
  query Test($id: String!) {
    atom(term_id: $id) {
      term_id
      label
    }
  }
`;

// Then add fields progressively
const complexQuery = gql`
  query Test($id: String!) {
    atom(term_id: $id) {
      term_id
      label
      type
      creator_id
      term {
        total_market_cap
        positions_aggregate {
          aggregate { count }
        }
      }
    }
  }
`;
```

### **3. Schema Introspection:**
Consult the v2 schema:
```bash
curl -X POST "https://testnet.intuition.sh/v1/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __schema { types { name fields { name type { name } } } } }"}'
```
Consult a specific type:
```bash
curl -X POST "https://testnet.intuition.sh/v1/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __type(name: \"triples\") { fields { name type { name kind } } } }"}'
```

---

## ❌ **Common GraphQL Errors and Solutions**

### **1. Non-existent Field:**
```
field 'id' not found in type: 'atoms'
```
**Solution:** Replace `id` with `term_id`

### **2. Incorrect Variable Type:**
```
variable 'tripleId' is declared as 'numeric!', but used where 'String!' is expected
```
**Solution:** Change `$tripleId: numeric!` to `$tripleId: String!`

### **3. Removed Relation:**
```
field 'vault' not found in type: 'triple'
```
**Solution:** Replace `vault` with `term`

### **4. Removed Field:**
```
field 'position_count' not found in type: 'term'
```
**Solution:** Use `positions_aggregate.aggregate.count`

### **5. Incorrect ID Format:**
```
GraphQL query returns {triple: null}
```
**Solution:** Convert `BigInt` to `0x...` string:
```typescript
const tripleId = `0x${id.toString(16).padStart(64, '0')}`;
```

### **6. Invalid GraphQL Structure:**
```
not a valid graphql query
```
**Solution:** Check indentation and closing braces

---

## 📝 **Concrete Migration Examples**

### **Example 1: Simple Query Migration**

```typescript
// ❌ v1 (Old)
const query = gql`
  query GetAtom($id: numeric!) {
    atom(id: $id) {
      id
      label
      vault {
        total_shares
        position_count
      }
    }
  }
`;

// ✅ v2 (New)
const query = gql`
  query GetAtom($id: String!) {
    atom(term_id: $id) {
      term_id
      label
      term {
        total_market_cap
        positions_aggregate {
          aggregate { count }
        }
      }
    }
  }
`;

// 💡 Key changes:
// - $id: numeric! → String!
// - atom(id: $id) → atom(term_id: $id)
// - id → term_id
// - vault → term
// - total_shares → total_market_cap
// - position_count → positions_aggregate { aggregate { count }}
```

### **Example 2: Complex Query Migration**

```typescript
// ❌ v1 (Old)
const query = gql`
  query GetTripleDetails($tripleId: numeric!) {
    triple(id: $tripleId) {
      id
      subject {
        id
        label
      }
      predicate {
        id
        label
      }
      object {
        id
        label
      }
      vault {
        total_shares
        position_count
      }
      counter_vault {
        total_shares
        position_count
      }
    }
  }
`;

// ✅ v2 (New)
const query = gql`
  query GetTripleDetails($tripleId: String!) {
    triple(term_id: $tripleId) {
      term_id
      subject {
        term_id
        label
      }
      predicate {
        term_id
        label
      }
      object {
        term_id
        label
      }
      term {
        total_market_cap
        positions_aggregate {
          aggregate { count }
        }
      }
      counter_term {
        total_market_cap
        positions_aggregate {
          aggregate { count }
        }
      }
    }
  }
`;

// 💡 Key changes:
// - $tripleId: numeric! → String!
// - triple(id: $tripleId) → triple(term_id: $tripleId)
// - id → term_id (everywhere)
// - vault → term
// - counter_vault → counter_term
// - total_shares → total_market_cap
// - position_count → positions_aggregate { aggregate { count }}
```

### **Example 3: Position Verification Query:**
```typescript
// ❌ v1 (Old)
const query = gql`
  query GetPositions($vaultId: numeric!) {
    vault(id: $vaultId) {
      position_count
    }
  }
`;

// ✅ v2 (New)
const query = gql`
  query GetPositions($termId: String!) {
    term(id: $termId) {
      positions_aggregate {
        aggregate { count }
      }
    }
  }
`;

// 💡 Key changes:
// - $vaultId: numeric! → String!
// - vault → term
// - $vaultId → $termId
// - position_count → positions_aggregate { aggregate { count }}
```

### **Example 4: Smart Contracts Migration - Deposits**

```typescript
// ❌ v1 (Old) - Specialized functions by type
// For a single atom
const depositAtom = async (receiver, id) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'depositAtom',
    args: [receiver, id],
    value: depositValue
  });
};

// For a single triple
const depositTriple = async (receiver, id) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'depositTriple',
    args: [receiver, id],
    value: depositValue
  });
};

// ✅ v2 (New) - Single function for one or multiple deposits
const deposit = async (receiver, termId, curveId, minShares) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'deposit',
    args: [receiver, termId, curveId, minShares],
    value: depositValue
  });
};

const depositBatch = async (receivers, termIds, curveIds, assets, minShares) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'depositBatch',
    args: [receivers, termIds, curveIds, assets, minShares],
    value: totalValue
  });
};

// 💡 Tip: For deposits, prefer depositBatch, it handles both simple and batch deposits
// You can deposit on Atoms and Triples in one action
// depositBatch handles all cases atom/triple, simple/batch deposits
```

### **Example 5: Atom Creation Migration**

```typescript
// ❌ v1 (Old) - Two distinct functions
// For a single atom
const createAtom = async (atomUri) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'createAtom',
    args: [atomUri],
    value: VALUE_PER_ATOM
  });
};

// For multiple atoms
const batchCreateAtom = async (atomUris) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'batchCreateAtom',
    args: [atomUris],
    value: totalValue
  });
};

// ✅ v2 (New) - Single function for one or multiple atoms
const createAtoms = async (data, assets) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'createAtoms',
    args: [data, assets],
    value: totalValue
  });
};
```

### **Example 6: Triple Creation Migration**

```typescript
// ❌ v1 (Old) - Two distinct functions
// For a single triple
const createTriple = async (subjectId, predicateId, objectId) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'createTriple',
    args: [subjectId, predicateId, objectId],
    value: VALUE_PER_TRIPLE
  });
};

// For multiple triples
const batchCreateTriple = async (subjectIds, predicateIds, objectIds) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'batchCreateTriple',
    args: [subjectIds, predicateIds, objectIds],
    value: totalValue
  });
};

// ✅ v2 (New) - Single function for one or multiple triples
const createTriples = async (subjectIds, predicateIds, objectIds, assets) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'createTriples',
    args: [subjectIds, predicateIds, objectIds, assets],
    value: totalValue
  });
};
```

### **Example 7: Atom Retrieval Query Migration**

```typescript
// ❌ v1 (Old)
const query = gql`
  query GetAtom($atomId: numeric!) {
    atom(id: $atomId) {
      id
      label
      creator_id
      vault {
        total_shares
        current_share_price
      }
    }
  }
`;

// ✅ v2 (New)
const query = gql`
  query GetAtom($atomId: String!) {
    atom(term_id: $atomId) {
      term_id
      label
      creator_id
      term {
        total_market_cap
        current_share_price
      }
    }
  }
`;

// 💡 Key changes:
// - $atomId: numeric! → String!
// - atom(id: $atomId) → atom(term_id: $atomId)
// - id → term_id
// - vault → term
// - total_shares → total_market_cap
```

### **Example 8: Triple Retrieval Query Migration**

```typescript
// ❌ v1 (Old)
const query = gql`
  query GetTriples($where: triples_bool_exp) {
    triples(where: $where) {
      id
      subject {
        id
        label
      }
      predicate {
        id
        label
      }
      object {
        id
        label
      }
      vault {
        total_shares
      }
      counter_vault {
        total_shares
      }
    }
  }
`;

// ✅ v2 (New)
const query = gql`
  query GetTriples($where: triples_bool_exp) {
    triples(where: $where) {
      term_id
      subject {
        term_id
        label
      }
      predicate {
        term_id
        label
      }
      object {
        term_id
        label
      }
      term {
        total_market_cap
      }
      counter_term {
        total_market_cap
      }
    }
  }
`;

// 💡 Key changes:
// - id → term_id (everywhere)
// - vault → term
// - counter_vault → counter_term
// - total_shares → total_market_cap
```

---

## 🎯 **Contract v2 Relations Structure**

### **Main Types:**
- **`atoms`**: `term_id`, `label`, `data`, `type`, `creator_id`
- **`terms`**: `id`, `total_market_cap`, `total_assets`, `positions`
- **`triples`**: `term_id`, `subject_id`, `predicate_id`, `object_id`

### **Relations:**
- **`triple.subject`** → **`atoms`** (via `subject_id`)
- **`triple.predicate`** → **`atoms`** (via `predicate_id`)
- **`triple.object`** → **`atoms`** (via `object_id`)
- **`triple.term`** → **`terms`** (via `term_id`)
- **`triple.counter_term`** → **`terms`** (via `counter_term_id`)

---

## 🔄 **Data Format Issues and ID Conversions**

### **Main Problem:**
**Contract v2** returns data with `term_id` but your **existing code** expects data with `id`.

### **Two Possible Approaches:**

#### **Approach 1: Transform Data (Recommended)**
```typescript
// ✅ Create a utility function for data transformation
const transformTripleData = (triple) => ({
  id: triple.term_id,  // Convert term_id → id
  subject: { 
    id: triple.subject.term_id, 
    label: triple.subject.label,
    type: triple.subject.type,
    image: triple.subject.image 
  },
  predicate: { 
    id: triple.predicate.term_id, 
    label: triple.predicate.label,
    type: triple.predicate.type 
  },
  object: { 
    id: triple.object.term_id, 
    label: triple.object.label,
    type: triple.object.type,
    image: triple.object.image 
  },
});

// Usage in queries
const fetchTriples = async () => {
  const data = await client.request(query);
  return data.triples.map(transformTripleData); // Transform data
};
```

#### **Approach 2: Modify All Code (More Work)**
```typescript
// ❌ Change everywhere in the code
// Instead of: triple.id
// Use: triple.term_id
```

### **Specific ID Conversions:**

#### **1. BigInt → String Hex (0x...)**
```typescript
// For smart contracts
const convertToHex = (bigIntId) => {
  return `0x${bigIntId.toString(16).padStart(64, '0')}`;
};

// Example
const id = BigInt("17684578708720383048295706142294460746182665123468931996900258680220266741419");
const hexId = convertToHex(id); // "0x27191de92fe0308355319ec8f2359e5ce85123bd243bf7ffa6eb8028347b3eab"
```

#### **2. String → BigInt**
```typescript
// For calculations
const convertToBigInt = (hexString) => {
  return BigInt(hexString);
};

// Example
const hexId = "0x27191de92fe0308355319ec8f2359e5ce85123bd243bf7ffa6eb8028347b3eab";
const bigIntId = convertToBigInt(hexId); //17684578708720383048295706142294460746182665123468931996900258680220266741419n
```

#### **3. Conversion for GraphQL**
```typescript
// GraphQL v2 expects Strings
const graphqlId = String(bigIntId);
// or
const graphqlId = hexString; // If already in 0x... format
```

### **Concrete Examples of Problems Encountered:**

#### **Problem 1: Rendering that only shows one element**
```bash
# Symptoms
- Application displays only 1 atom instead of several
- Console: id: undefined in elements
- Console: predicateId: undefined in relations
```
**Cause:** Component expects `id` but receives `term_id`  
**Solution:** Use `transformTripleData` before passing data to component

#### **Problem 2: ID format error in smart contracts**
```bash
# Error
Failed to fetch triple details
```
**Cause:** ID converted to BigInt instead of staying in 0x... format  
**Solution:** Keep ID in hex format for GraphQL, convert only for smart contract

#### **Problem 3: TypeScript type incompatibility**
```bash
# Error
Type 'string' is not assignable to type 'bigint'
```
**Cause:** Mix between string and bigint formats  
**Solution:** Standardize types and use explicit conversions

### **Best Practices for Conversions:**

1. **Centralize conversions** in utility functions
2. **Document formats** expected by each part of the code
3. **Test conversions** with real examples
4. **Use logs** to verify formats at each step
5. **Prefer data transformation** over modifying existing code

---

## 🚀 **Migration Best Practices**

### **1. Incremental Migration:**
- Migrate one component at a time
- Test each component individually
- Maintain compatibility during transition

### **2. Error Handling:**
- Add detailed logs
- Implement fallbacks
- Handle failure cases gracefully

### **3. Testing:**
- Unit tests for each hook
- Integration tests for components
- End-to-end tests for complete workflow

### **4. Documentation:**
- Document each change
- Maintain a migration journal
- Create guides for the team

---

## 📊 **Success Metrics**

### **Technical Indicators:**
- [ ] **0 GraphQL errors** in console
- [ ] **100% of queries** migrated successfully
- [ ] **All components** rendered correctly
- [ ] **Smart contracts** functional

### **Functional Indicators:**
- [ ] **Complete workflow** operational
- [ ] **Performance** maintained or improved
- [ ] **UX** identical or improved
- [ ] **Data** consistent

---

## 🔧 **Tools and Resources**

### **Debug Tools:**
- **GraphQL Playground**: Test queries
- **Browser DevTools**: Logs and errors
- **Network Tab**: Check HTTP requests

### **Reference Resources:**
- **GraphQL v2 Schema**: `migration-resources/schema-graph.doc`
- **Contract ABI**: `migration-resources/old-contract.doc`
- **Query Examples**: `migration-resources/useful-queries-responses.doc`
- **Migration Plan**: `migration-resources/migration-plan-[YOUR_PROJECT].md`

### **Useful Commands:**
```bash
# Schema introspection
curl -X POST "https://testnet.intuition.sh/v1/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __schema { types { name } } }"}'
```
```bash
# Test a specific query
curl -X POST "https://testnet.intuition.sh/v1/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { atoms(limit: 1) { term_id label } }"}'
```

---

## 🎉 **Conclusion**

This universal guide allows you to migrate any project from GraphQL v1 to v2 by following a structured and proven methodology.

**Don't forget to:**
1. **Create** your reference files in `migration-resources/`
2. **Follow** the migration checklist
3. **Test** each step individually
4. **Document** your changes
5. **Validate** the final result

**Happy migrating!** 🚀

---
