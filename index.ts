import { serve } from "https://deno.land/std@0.157.0/http/server.ts";

const handler = async (request: Request): Promise<Response> => {
  const requestUrl = new URL(request.url);
  let pokemonNumber = requestUrl.searchParams.get("number");

  // パラメータが未入力の場合は25とする
  if (!pokemonNumber) {
    pokemonNumber = "25";
  }

  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/`;
  const resp = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });

  let body = `
    <form>
      <label for="number">ポケモンのナンバー: </label>
      <input type="number" id="number" name="number" value="${pokemonNumber}" min="1" max="893">
      <input type="submit" value="検索">
    </form>
    <br>
    <p>Not Found. number: ${pokemonNumber}`;
  if (resp.status === 200) {
    const json = await resp.json();
    body = `
      <form>
        <label for="number">Pokemon Number: </label>
        <input type="number" id="number" name="number" value="${pokemonNumber}" min="1" max="1008">
        <input type="submit" value="GET">
      </form>
      <br>
      <p>Id: ${json["id"]}</p>
      <p>Name: ${json["name"]}</p>
      <img src="${json["sprites"]["front_default"]}" alt="${json["name"]}">
    `;
  }

  return new Response(body, {
    status: resp.status,
    headers: {
      "content-type": "text/html",
    },
  });
};

serve(handler);
