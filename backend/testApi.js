async function run() {
  try {
    const res = await fetch("http://localhost:30001/api/ai/skill-gap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId: "662b1a9c3d91b4001c9a0000", jobDescription: "developer" })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data:", data);
  } catch (e) {
    console.error(e);
  }
}
run();
