---
sidebar_position: 2
---

# Guide de Migration Contrat v1 → v2
## Guide Universel pour Migrer n'importe quel Projet

---

## 🎯 **Objectif**
Ce guide universel aide les développeurs à migrer **n'importe quel projet** de Contrat v1 vers v2, en se basant sur les bonnes pratiques et les erreurs courantes identifiées lors de migrations réelles.

### **📝 Contexte de Création**
Ce guide a été créé **en parallèle** d'une migration réelle, documentant :
- Les changements de formats de données
- Les problèmes techniques rencontrés
- Les solutions appliquées
- Les requêtes personnalisées spécifiques au projet

### **⚠️ Limitations**
- Les exemples fournis ne constituent **pas une liste exhaustive**
- Chaque projet peut avoir ses spécificités
- Certaines requêtes peuvent nécessiter des adaptations selon votre contexte

### **🤖 Support IA et Context**
Ce guide recommande fortement de créer un dossier `migration-resources/` contenant (voir prérequis) :
- **L'ABI de l'ancien contrats**
- **Le Schémas GraphQL**
- **Journal de migration** avec requêtes et réponses
- **Plan de migration** personnalisé

**Pourquoi ?** Ces ressources permettent de fournir un **contexte complet** à un agent IA, facilitant considérablement le processus de migration et la résolution de problèmes spécifiques à votre projet.

---

## 📝 **Template de Plan de Migration**

```markdown
# Plan de Migration Contrat v1 → v2 - [NOM_DU_PROJET]

## Phase A : Analyse ✅
- [ ] Identifier les endpoints utilisés
- [ ] Lister les types GraphQL
- [ ] Analyser l'architecture

## Phase B : Migration des Endpoints ✅
- [ ] Mettre à jour les URLs
- [ ] Tester la connectivité

## Phase C : Migration des Requêtes ✅
- [ ] Adapter les identifiants
- [ ] Changer les types de variables
- [ ] Remplacer les relations

## Phase D : Migration des Composants ✅
- [ ] Migrer les hooks
- [ ] Adapter les composants
- [ ] Mettre à jour les interfaces

## Phase E : Tests et Validation ✅
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Tests end-to-end
```

---

## 📚 **Prérequis : Créer vos Fichiers de Référence**

### **1. Obtenir le Nouveau ABI :**
```bash
# Télécharger l'ABI du contrat v2 depuis votre source
```

### **2. Avant de commencer votre migration, créez ces fichiers de référence dans un dossier `migration-resources/` :**

#### **2.1 Créer une Copie de l'Ancien Contrat :**
```bash
# Sauvegarder l'ABI de l'ancien contrat
# Sauvegarder dans : migration-resources/old-contrat.doc
```

#### **2.2 Obtenir le Schéma GraphQL v2 :**
Exécuter cette commande pour obtenir le schéma complet :
```bash
curl -X POST "https://testnet.intuition.sh/v1/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __schema { types { name fields { name type { name kind ofType { name kind } } } } } }"}' \
```
  > Copiez la reponse dans migration-resources/schemaGraph.doc

#### **2.3 Créer un Journal de Migration :**
```bash
# Créer : migration-resources/requete-utile-reponse.doc
# Y documenter vos requêtes v1 vs v2, erreurs rencontrées, solutions
```

#### **2.4 Créer un Plan de Migration :**
```bash
# Créer : migration-resources/migration-plan-[VOTRE_PROJET].md
# Adapter le template fourni à votre projet
# 1h de préparation = 10h de gagnées par la suite
```

---

## 📋 **Checklist de Migration Universelle**

### **Phase 1 : Préparation**
- [ ] **Analyser** l'architecture actuelle du projet
- [ ] **Identifier** tous les endpoints GraphQL utilisés
- [ ] **Lister** tous les types GraphQL (atoms, terms, triples, etc.)
- [ ] **Consulter** le schéma v2 pour comprendre les changements
- [ ] **Créer** un plan de migration structuré → migration-resources/migration-plan-[VOTRE_PROJET].md
- [ ] **Sauvegarder** le code existant (branche de sauvegarde)

### **Phase 2 : Migration des Endpoints**
- [ ] **Mettre à jour** les URLs des endpoints
- [ ] **Vérifier** la compatibilité des réseaux (mainnet/testnet)
- [ ] **Tester** la connectivité avec les nouveaux endpoints
- [ ] **Valider** que les endpoints répondent correctement

### **Phase 3 : Migration des Requêtes GraphQL**
- [ ] **Adapter** les identifiants (`id` → `term_id`)
- [ ] **Changer** les types de variables (`numeric` → `String`)
- [ ] **Remplacer** les relations supprimées (`vaults` → `terms`)
- [ ] **Mettre à jour** les champs supprimés (`position_count` → `positions_aggregate`)
- [ ] **Tester** chaque requête individuellement

### **Phase 4 : Migration des Hooks/Composants**
- [ ] **Migrer** les hooks de récupération de données
- [ ] **Adapter** les composants d'affichage
- [ ] **Mettre à jour** les interfaces TypeScript
- [ ] **Tester** le rendu des composants

### **Phase 5 : Migration des Smart Contracts**
- [ ] **Vérifier** la compatibilité des ABI
- [ ] **Adapter** les appels de fonctions (`depositTriple` → `depositBatch`)
- [ ] **Mettre à jour** les types de données (`BigInt` → `0x...` string)
- [ ] **Tester** les interactions avec les contrats

### **Phase 6 : Tests et Validation**
- [ ] **Tests unitaires** pour chaque composant migré
- [ ] **Tests d'intégration** avec les smart contracts
- [ ] **Tests end-to-end** du workflow complet
- [ ] **Gestion des erreurs** et cas d'échec

---

## 🔄 **Changements de Schéma Universels**

### **Identifiants (ID Fields) :**
```typescript
// ❌ v1 (Ancien)
atoms: { id: string }
triples: { id: string }

// ✅ v2 (Nouveau)
atoms: { term_id: string }
triples: { term_id: string }
terms: { id: string } // Reste inchangé
```

### **Relations (Relationships) :**
```typescript
// ❌ v1 (Ancien)
vaults
claims

// ✅ v2 (Nouveau)
terms (remplace vaults)
triples (remplace claims)
```

### **Champs Supprimés (Removed Fields) :**
```typescript
// ❌ v1 (Ancien)
position_count: number
total_shares: number
block_timestamp: string

// ✅ v2 (Nouveau)
positions_aggregate: { aggregate: { count: number } }
total_market_cap: number
created_at: string
```

### **Types de Variables (Variable Types) :**
```typescript
// ❌ v1 (Ancien)
$id: numeric!
$tripleId: numeric!

// ✅ v2 (Nouveau)
$id: String!
$tripleId: String!
```

---

## 🛠️ **Méthode de Debug Universelle**

### **1. Logs de Debug Systématiques :**
```typescript
// Ajouter dans chaque requête/hook
console.log("🔍 Requête GraphQL:", query);
console.log("📊 Variables:", variables);
console.log("📡 Réponse:", result);
console.log("❌ Erreur:", error);
```

### **2. Test Étape par Étape :**
```typescript
// Commencer par une requête simple
const simpleQuery = gql`
  query Test($id: String!) {
    atom(term_id: $id) {
      term_id
      label
    }
  }
`;

// Puis ajouter les champs progressivement
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

### **3. Introspection du Schéma :**
Consulter le schéma v2 :
```bash
curl -X POST "https://testnet.intuition.sh/v1/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __schema { types { name fields { name type { name } } } } }"}'
```
Consulter un type spécifique :
```bash
curl -X POST "https://testnet.intuition.sh/v1/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __type(name: \"triples\") { fields { name type { name kind } } } }"}'
```

---

## ❌ **Erreurs GraphQL Courantes et Solutions**

### **1. Champ Inexistant :**
```
field 'id' not found in type: 'atoms'
```
**Solution :** Remplacer `id` par `term_id`

### **2. Type de Variable Incorrect :**
```
variable 'tripleId' is declared as 'numeric!', but used where 'String!' is expected
```
**Solution :** Changer `$tripleId: numeric!` en `$tripleId: String!`

### **3. Relation Supprimée :**
```
field 'vault' not found in type: 'triple'
```
**Solution :** Remplacer `vault` par `term`

### **4. Champ Supprimé :**
```
field 'position_count' not found in type: 'term'
```
**Solution :** Utiliser `positions_aggregate.aggregate.count`

### **5. Format d'ID Incorrect :**
```
GraphQL query returns {triple: null}
```
**Solution :** Convertir `BigInt` en `0x...` string :
```typescript
const tripleId = `0x${id.toString(16).padStart(64, '0')}`;
```

### **6. Structure GraphQL Invalide :**
```
not a valid graphql query
```
**Solution :** Vérifier l'indentation et les accolades fermantes

---

## 📝 **Exemples Concrets de Migration**

### **Exemple 1 : Migration d'une Requête Simple**

```typescript
// ❌ v1 (Ancien)
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

// ✅ v2 (Nouveau)
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

// 💡 Changements clés :
// - $Id: numeric! → String!
// - atom(id: $Id) → atom(term_id: $Id)
// - id → term_id
// - vault → term
// - total_shares → total_market_cap
// - position_count → positions-aggregate { aggregate { count }}
```

### **Exemple 2 : Migration d'une Requête Complexe**

```typescript
// ❌ v1 (Ancien)
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

// ✅ v2 (Nouveau)
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

// 💡 Changements clés :
// - $tripleId: numeric! → String!
// - triple(id: $tripleId) → triple(term_id: $tripleId)
// - id → term_id (partout)
// - vault → term
// - counter_vault → counter_term
// - total_shares → total_market_cap
// - position_count → positions-aggregate { aggregate { count }}
```

### **Exemple 3 : Requête de Vérification des Positions :**
```typescript
// ❌ v1 (Ancien)
const query = gql`
  query GetPositions($vaultId: numeric!) {
    vault(id: $vaultId) {
      position_count
    }
  }
`;

// ✅ v2 (Nouveau)
const query = gql`
  query GetPositions($termId: String!) {
    term(id: $termId) {
      positions_aggregate {
        aggregate { count }
      }
    }
  }
`;

// 💡 Changements clés :
// - $vaultId: numeric! → String!
// - vault → term
// - $vaultId → $termId
// - position_count → positions-aggregate { aggregate { count }}
```

### **Exemple 4 : Migration des Smart Contracts - Dépôts**

```typescript
// ❌ v1 (Ancien) - Fonctions spécialisées par type
// Pour un seul atome
 const depositAtom = async (receiver, id) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'depositAtom',
    args: [receiver, id],
    value: depositValue
  });
};

// Pour un seul triple
const depositTriple = async (receiver, id) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'depositTriple',
    args: [receiver, id],
    value: depositValue
  });
};

// ✅ v2 (Nouveau) - Une seule fonction pour un ou plusieurs dépôts
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

// 💡 Conseil : Pour les dépôts, préférez depositBatch, elle gére aussi bien les dépôts simple que batch
// Vous pouvez déposer sur des Atoms et Triples en une action
// depositBatch gére tous les cas atom/triple, dépôts simple/batch
```

### **Exemple 5 : Migration de la Création d'Atomes**

```typescript
// ❌ v1 (Ancien) - Deux fonctions distinctes
// Pour un seul atome
const createAtom = async (atomUri) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'createAtom',
    args: [atomUri],
    value: VALUE_PER_ATOM
  });
};

// Pour plusieurs atomes
const batchCreateAtom = async (atomUris) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'batchCreateAtom',
    args: [atomUris],
    value: totalValue
  });
};

// ✅ v2 (Nouveau) - Une seule fonction pour un ou plusieurs atomes
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

### **Exemple 6 : Migration de la Création de Triples**

```typescript
// ❌ v1 (Ancien) - Deux fonctions distinctes
// Pour un seul triple
const createTriple = async (subjectId, predicateId, objectId) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'createTriple',
    args: [subjectId, predicateId, objectId],
    value: VALUE_PER_TRIPLE
  });
};

// Pour plusieurs triples
const batchCreateTriple = async (subjectIds, predicateIds, objectIds) => {
  return await writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'batchCreateTriple',
    args: [subjectIds, predicateIds, objectIds],
    value: totalValue
  });
};

// ✅ v2 (Nouveau) - Une seule fonction pour un ou plusieurs triples
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

### **Exemple 7 : Migration des Requêtes de Récupération d'Atome**

```typescript
// ❌ v1 (Ancien)
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

// ✅ v2 (Nouveau)
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

// 💡 Changements clés :
// - $atomId: numeric! → String!
// - atom(id: $atomId) → atom(term_id: $atomId)
// - id → term_id
// - vault → term
// - total_shares → total_market_cap
```

### **Exemple 8 : Migration d'une Requête de Récupération de Triple**

```typescript
// ❌ v1 (Ancien)
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

// ✅ v2 (Nouveau)
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

// 💡 Changements clés :
// - id → term_id (partout)
// - vault → term
// - counter_vault → counter_term
// - total_shares → total_market_cap
```

---

## 🎯 **Structure des Relations dans Contrat v2**

### **Types Principaux :**
- **`atoms`** : `term_id`, `label`, `data`, `type`, `creator_id`
- **`terms`** : `id`, `total_market_cap`, `total_assets`, `positions`
- **`triples`** : `term_id`, `subject_id`, `predicate_id`, `object_id`

### **Relations :**
- **`triple.subject`** → **`atoms`** (via `subject_id`)
- **`triple.predicate`** → **`atoms`** (via `predicate_id`)
- **`triple.object`** → **`atoms`** (via `object_id`)
- **`triple.term`** → **`terms`** (via `term_id`)
- **`triple.counter_term`** → **`terms`** (via `counter_term_id`)

---

## 🔄 **Problèmes de Format de Données et Conversions d'ID**

### **Problème Principal :**
**Contrat v2** retourne des données avec `term_id` mais votre **code existant** attend des données avec `id`.

### **Deux Approches Possibles :**

#### **Approche 1 : Transformer les Données (Recommandée)**
```typescript
// ✅ Créer une fonction utilitaire de transformation
const transformTripleData = (triple) => ({
  id: triple.term_id,  // Conversion term_id → id
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

// Utilisation dans les requêtes
const fetchTriples = async () => {
  const data = await client.request(query);
  return data.triples.map(transformTripleData); // Transformation
};
```

#### **Approche 2 : Modifier Tout le Code (Plus de Travail)**
```typescript
// ❌ Changer partout dans le code
// Au lieu de : triple.id
// Utiliser : triple.term_id
```

### **Conversions d'ID Spécifiques :**

#### **1. Conversion BigInt → String Hex (0x...)**
```typescript
// Pour les smart contracts
const convertToHex = (bigIntId) => {
  return `0x${bigIntId.toString(16).padStart(64, '0')}`;
};

// Exemple
const id = BigInt("17684578708720383048295706142294460746182665123468931996900258680220266741419");
const hexId = convertToHex(id); // "0x27191de92fe0308355319ec8f2359e5ce85123bd243bf7ffa6eb8028347b3eab"
```

#### **2. Conversion String → BigInt**
```typescript
// Pour les calculs
const convertToBigInt = (hexString) => {
  return BigInt(hexString);
};

// Exemple
const hexId = "0x27191de92fe0308355319ec8f2359e5ce85123bd243bf7ffa6eb8028347b3eab";
const bigIntId = convertToBigInt(hexId); //17684578708720383048295706142294460746182665123468931996900258680220266741419n
```

#### **3. Conversion pour GraphQL**
```typescript
// Contrat v2 attend des String
const graphqlId = String(bigIntId);
// ou
const graphqlId = hexString; // Si déjà en format 0x...
```

### **Exemples Concrets de Problèmes Rencontrés :**

#### **Problème 1 : Rendu qui n'affiche qu'un élément**
```bash
# Symptômes
- L'application affiche seulement 1 atome au lieu de plusieurs
- Console : id: undefined dans les éléments
- Console : predicateId: undefined dans les relations
```
**Cause :** Le composant attend `id` mais reçoit `term_id`  
**Solution :** Utiliser `transformTripleData` avant de passer les données au composant

#### **Problème 2 : Erreur de format d'ID dans les smart contracts**
```bash
# Erreur
Failed to fetch triple details
```
**Cause :** ID converti en BigInt au lieu de rester en format 0x...  
**Solution :** Garder l'ID en format hex pour GraphQL, convertir seulement pour le smart contract

#### **Problème 3 : Incompatibilité de types TypeScript**
```bash
# Erreur
Type 'string' is not assignable to type 'bigint'
```
**Cause :** Mélange entre formats string et bigint  
**Solution :** Standardiser les types et utiliser des conversions explicites

### **Bonnes Pratiques pour les Conversions :**

1. **Centraliser les conversions** dans des fonctions utilitaires
2. **Documenter les formats** attendus par chaque partie du code
3. **Tester les conversions** avec des exemples réels
4. **Utiliser des logs** pour vérifier les formats à chaque étape
5. **Préférer la transformation des données** plutôt que la modification du code existant

---

## 🚀 **Bonnes Pratiques de Migration**

### **1. Migration Incrémentale :**
- Migrer un composant à la fois
- Tester chaque composant individuellement
- Maintenir la compatibilité pendant la transition

### **2. Gestion des Erreurs :**
- Ajouter des logs détaillés
- Implémenter des fallbacks
- Gérer les cas d'échec gracieusement

### **3. Tests :**
- Tests unitaires pour chaque hook
- Tests d'intégration pour les composants
- Tests end-to-end pour le workflow complet

### **4. Documentation :**
- Documenter chaque changement
- Maintenir un journal de migration
- Créer des guides pour l'équipe

---

## 📊 **Métriques de Succès**

### **Indicateurs Techniques :**
- [ ] **0 erreur GraphQL** dans la console
- [ ] **100% des requêtes** migrées avec succès
- [ ] **Tous les composants** rendus correctement
- [ ] **Smart contracts** fonctionnels

### **Indicateurs Fonctionnels :**
- [ ] **Workflow complet** opérationnel
- [ ] **Performance** maintenue ou améliorée
- [ ] **UX** identique ou améliorée
- [ ] **Données** cohérentes

---

## 🔧 **Outils et Ressources**

### **Outils de Debug :**
- **GraphQL Playground** : Tester les requêtes
- **Browser DevTools** : Logs et erreurs
- **Network Tab** : Vérifier les requêtes HTTP

### **Ressources de Référence :**
- **Schéma GraphQL v2** : `migration-resources/schemaGraph.doc`
- **ABI du contrat** : `migration-resources/old-contrat.doc`
- **Exemples de requêtes** : `migration-resources/requete-utile-reponse.doc`
- **Plan de migration** : `migration-resources/migration-plan-[VOTRE_PROJET].md`

### **Commandes Utiles :**
```bash
# Introspection du schéma
curl -X POST "https://testnet.intuition.sh/v1/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __schema { types { name } } }"}'`
  ```
  ```bash
# Test d'une requête spécifique
curl -X POST "https://testnet.intuition.sh/v1/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { atoms(limit: 1) { term_id label } }"}'
```

---

## 🎉 **Conclusion**

Ce guide universel vous permet de migrer n'importe quel projet de Contrat v1 vers v2 en suivant une méthodologie structurée et éprouvée. 

**N'oubliez pas de :**
1. **Créer** vos fichiers de référence dans `migration-resources/`
2. **Suivre** la checklist de migration
3. **Tester** chaque étape individuellement
4. **Documenter** vos changements
5. **Valider** le résultat final

**Bonne migration !** 🚀

---
