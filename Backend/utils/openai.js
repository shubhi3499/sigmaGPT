import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("OpenAI raw response:", data);


    if (data.error) {
      console.error("OpenAI API ERROR:", data.error);
      return "Sorry, something went wrong while generating a response.";
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected OpenAI response format:", data);
      return "I couldn't understand the response from the AI.";
    }

    return data.choices[0].message.content;

  } catch (err) {
    console.error("OpenAI FETCH ERROR:", err);
    return "I couldn't generate a response due to a server error.";
  }
};

export default getOpenAIAPIResponse;
