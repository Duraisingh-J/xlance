export const submitProposal = async (proposal) => {
  return await addDoc(collection(db, "proposals"), {
    ...proposal,
    status: "submitted",
    createdAt: serverTimestamp(),
  });
};