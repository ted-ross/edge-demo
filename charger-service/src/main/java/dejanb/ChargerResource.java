package dejanb;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.Arrays;
import java.util.List;

@Path("/charger")
public class ChargerResource {


    List<Boolean> charging;

    public ChargerResource() {
        charging = Arrays.asList(false, false, false, false, false);
    }

    @POST
    @Path("/start/{id}")
    public void start(@PathParam("id") int id) {
        charging.set(id, true);
    }
    
    @POST
    @Path("/stop/{id}")
    public void stop(@PathParam("id") int id) {
        charging.set(id, false);
    }    

    @GET
    @Path("/status/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    public boolean status(@PathParam("id") int id) {
        return charging.get(id);
    }

    @GET
    @Path("/status")
    @Produces(MediaType.TEXT_PLAIN)
    public List status() {
        return charging;
    }

    @GET
    @Path("/available")
    @Produces(MediaType.TEXT_PLAIN)
    public long available() {
        return charging.stream().filter(charging -> charging == false).count();
    }
    
}