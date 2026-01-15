package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import util.API;
import util.SSLBypass;

@WebServlet(name = "DownloadMusic", urlPatterns = {"/DownloadMusic"})
public class DownloadMusic extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        String songId = request.getParameter("songId");

        SSLBypass.trustAllHosts();

        URL url = new URL("https://spotify-downloader9.p.rapidapi.com/downloadSong?songId=" + songId);
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

        JsonObject song = gson.fromJson(content.toString(), JsonObject.class);
        if (song.get("success").getAsBoolean()) {
            try {
                JsonObject songData = song.getAsJsonObject("data");

                URL downLoadUrl = new URL(songData.get("downloadLink").getAsString());
                URLConnection downloadConnection = downLoadUrl.openConnection();
                InputStream is = downloadConnection.getInputStream();

                System.out.println("downloading song");
                System.out.println(downloadConnection.getContentLength());

                response.setContentType("audio/mpeg");
                response.setContentType("application/octet-stream");
                response.setHeader("Content-disposition", "attachment; filename=" + songId + ".mp3");
                response.setContentLength(downloadConnection.getContentLength());
                response.setBufferSize(8 * 1024 * 1024);

                ServletOutputStream out = response.getOutputStream();

                byte[] buffer = new byte[8 * 1024 * 1024];

                int numBytesRead;
                while ((numBytesRead = is.read(buffer)) > 0) {
                    out.write(buffer, 0, numBytesRead);
                }
                out.flush();
                System.out.println("download success");
            } catch (Exception e) {
                e.printStackTrace();
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Something went wrong. Try again later.");
            }
        } else {
            System.out.println(song.get("message").getAsString());
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Something went wrong. Try again later.");
            System.out.println("download failed");
        }
    }

}
