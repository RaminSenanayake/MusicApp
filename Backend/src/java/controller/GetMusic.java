package controller;

import com.google.gson.Gson;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import util.API;
import util.SSLBypass;

/**
 *
 * @author senan
 */
@WebServlet(name = "GetMusic", urlPatterns = {"/GetMusic"})
public class GetMusic extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        String queryString = request.getQueryString();
        
        SSLBypass.trustAllHosts();
        
        URL url = new URL("https://spotify-downloader9.p.rapidapi.com/search?" + queryString);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");
        con.setRequestProperty("x-rapidapi-key", API.apikey);
        con.setRequestProperty("x-rapidapi-host", "spotify-downloader9.p.rapidapi.com");

        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuilder content = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            content.append(inputLine);
        }

        String toJson = gson.toJson(content);
        response.getWriter().write(toJson);
        System.out.println("search success");
    }

}
